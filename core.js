const express = require('express');
const { default: WAConnection, DisconnectReason, Browsers, fetchLatestBaileysVersion, makeInMemoryStore, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const chalk = require('chalk');
const QuickDB = require('quick.db');
const moment = require('moment-timezone');
const fs = require('fs');
const { Collection } = require('discord.js');
const contact = require('./mangoes/contact.js');
const config = require('./config.js');
const botName = config.botName;
const { createCanvas, loadImage } = require('canvas');
const MessageHandler = require('./lib/message/vorterx');

async function startAztec() {
  const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds, clearState } = await useMultiFileAuthState('session_Id');

  const vorterx = WAConnection({
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
    browserDescription: Browsers.macOS("Desktop"),
    qrTimeoutMs: undefined,
    auth: state,
    version
  });
  
  store.bind(vorterx.ev);
  vorterx.cmd = new Collection();
  vorterx.contact = contact;

  await readCommands(vorterx);

  vorterx.ev.on('auth-state-update', saveCreds);
  vorterx.ev.on('connection-update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (update.qr) {
      console.log(`[${chalk.red('!')}]`, 'white');
      const qrImage = await generateQRImage(update.qr);
      vorterx.QR = qrImage;
    }
    if (
      connection === DisconnectReason.close ||
      connection === DisconnectReason.lost ||
      connection === DisconnectReason.restart ||
      connection === DisconnectReason.timeout
    ) {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;

      console.log(`Connection ${connection}, reconnecting...`);

      if (reason === DisconnectReason.loggedOut) {
        console.log('Device Logged Out, Please Delete Session and Scan Again.');
        process.exit();
      }

      await startAztec();
    } else if (connection === DisconnectReason.close) {
      console.log(`[🐲AZTEC] Connection closed, reconnecting...`);
      await startAztec();
    } else if (connection === DisconnectReason.lost) {
      console.log(`[🦅AZTEC] Connection Lost from Server, reconnecting...`);
      await startAztec();
    } else if (connection === DisconnectReason.restart) {
      console.log(`[🦅AZTEC] Server has just started...`);
      await startAztec();
    } else if (connection === DisconnectReason.timeout) {
      console.log(`[🐲AZTEC] Connection Timed Out, Trying to Reconnect...`);
      await startAztec();
    } else {
      console.log(`[🦅AZTEC] Server Disconnected: Maybe Your WhatsApp Account has got banned`);
    }
  });

  vorterx.ev.on('message-new', async (messages) => {
    await MessageHandler(messages, vorterx);
  });
  vorterx.ev.on('contacts-received', async ({ updatedContacts }) =>
    await contact.saveContacts(updatedContacts, vorterx)
  );

  vorterx.ev.on('open', async () => {
    const user = vorterx.user.id;
    const connectionMessage = `Aztec-MD has connected | BotName: ${botName} | PREFIX: ${config.prefix}`;

    try {
      await vorterx.sendMessage(vorterx.user.id, connectionMessage, 'conversation');
      console.log(`[🦅AZTEC] Connection message sent to ${vorterx.user.id}`);
    } catch (error) {
      console.error('[🦅AZTEC] Failed to send connection message:', error);
    }
  });

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.get('/', (req, res) => {
    res.status(200).setHeader('Content-Type', 'image/png').send(vorterx.QR);
  });

  app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

async function generateQRImage(qrData) {
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');
  const qrImage = await loadImage(qrData);
  ctx.drawImage(qrImage, 0, 0, 300, 300);
  return canvas.toBuffer('image/png');
}

async function readCommands(vorterx) {
  const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    vorterx.cmd.set(command.name, command);
  }
}

startAztec();

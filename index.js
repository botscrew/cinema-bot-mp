import readline from 'readline';
import 'dotenv/config';
import {getBotReply} from "./openaiClient.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'You: '
});

console.log('Chat started. Type your message below (type "exit" to quit):');
rl.prompt();

rl.on('line', async (input) => {
    const trimmed = input.trim();

    if (trimmed.toLowerCase() === 'exit') {
        console.log('Chat ended.');
        rl.close();
        return;
    }

    const response = await getBotReply(trimmed);
    console.log(`Bot: ${response}`);
    rl.prompt();
});

rl.on('close', () => {
    process.exit(0);
});

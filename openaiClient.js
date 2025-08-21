import OpenAI from 'openai';
import 'dotenv/config';
import {INSTRUCTIONS, TOOLS} from "./constants.js";
import {getAllMovies, getMovieSessionsByMovieId} from "./dbClient.js";
import {getTopK} from "./vectordbClient.js";

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const chatHistory = [{ role: 'developer', content: INSTRUCTIONS }]

function addUserMessageToChatHistory(userMessage){
    chatHistory.push({ role: 'user', content: userMessage})
}

async function runCompletion(){
    const completion = await  client.chat.completions.create({
        model: 'gpt-4o',
        messages: chatHistory,
        tools: TOOLS
    });

    chatHistory.push(completion.choices[0].message)
    if (completion.choices[0].message.content){
        return completion.choices[0].message.content
    }

    const tool_call = completion.choices[0].message.tool_calls[0];
    await run_tool(tool_call.function.name, JSON.parse(tool_call.function.arguments), tool_call.id)
    return await runCompletion()
}

async function run_tool(name, args, tool_call_id){
    let result = '';
    if (name == "getAllMovies"){
        result = await getAllMovies()
    }else if(name == "getMovieSessionsByMovieId"){
        result = await getMovieSessionsByMovieId(args.movie_id);
    } else if (name == "getCinemaKnowledge"){
        result = await getTopK(args.user_message, 3)
    }
    else {
        console.error("No such function")
    }
    chatHistory.push({
        role: "tool",
        content: JSON.stringify(result),
        tool_call_id: tool_call_id
    })

}

export async function getBotReply(userMessage) {
    addUserMessageToChatHistory(userMessage);
    return await runCompletion()
}



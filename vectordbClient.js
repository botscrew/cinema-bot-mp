import * as lancedb from "@lancedb/lancedb";
import { Utf8 } from "apache-arrow";
import { LanceSchema, getRegistry } from "@lancedb/lancedb/embedding";
import "@lancedb/lancedb/embedding/openai";
import 'dotenv/config';


const tableName = "multiplex_embedding"
const vectorDB = await lancedb.connect('multiplex');

const embeddingFunc = getRegistry()
    .get("openai")
    ?.create({ model: "text-embedding-3-small" }) ;

const chunksSchema = LanceSchema({
    text: embeddingFunc.sourceField(new Utf8()),
    vector: embeddingFunc.vectorField(),
});

async function getTable(){
    const tableNames = await vectorDB.tableNames();

    if (tableNames.includes(tableName)){
        return await vectorDB.openTable(tableName);
    }

    return await vectorDB.createEmptyTable(tableName, chunksSchema, {
        mode: "overwrite",
    });
}

export async function addText(text ){
    const table = await getTable();
    await table.add([{ text: text }]);
}

export async function getTopK(userMessage, topK){
    const table = await getTable();
    const result = await table.search(userMessage).limit(topK).toArray();
    console.log("------------------------------------------------------------------------------");
    result.forEach(el =>{
        console.log(el.text + " " + el._distance);
    })
    console.log("------------------------------------------------------------------------------");
    return result;
}

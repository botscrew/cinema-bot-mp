import {EXTERNAL_DATA} from "./externalData.js";
import {addText} from "./vectordbClient.js";

export async function loadData(){
    const chunks = EXTERNAL_DATA.split('\n\n');
    for (const chunk of chunks) {
       console.log(chunk);
       await addText(chunk);
    }
}


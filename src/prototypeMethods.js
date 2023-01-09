import Vue from "vue";
import axios from "axios";

function formatString (string) {
    if(string && string.length > 20) {
        let str = string.slice(string.indexOf('-') + 1);
        // console.log(`${string} Formatted to ${str}`);
        return str
    } 
    return string
}

function formatObject(object, keys) {
    let i = 0;
    for (const property in object) {
        if(property.length > 20){
            object[keys[i]] = object[property];
            delete object[property];
        }
        i++;
    }
}

function sortKeys(keys, key) {
    let renamed = keys.indexOf(key) * 0.01 + '-' + key;
    return renamed.replace('.', '');
}

Vue.prototype.$reorderByElement = function (obj, element,element2) {
    let keys = Object.keys(obj)
    keys = keys.map(key => {
        return formatString(key)
    });

    element = formatString(element);
    element2 = formatString(element2);
    formatObject(obj, keys);
    keys = keys.filter(el => el !== element);
    let index2 = keys.indexOf(element2) || null;
    if(!element2){
        keys.push(element)
    } else{
        keys.splice(index2, 0 , element);
    }
    return keys.reduce((a,b) => 
         ({...a, [sortKeys(keys,b)]: obj[b]}), {})
}

Vue.prototype.$reorderByUrl = async function(url, from, to) {
    let response = await axios.get(url);

    let reorderedObj = Vue.prototype.$reorderByElement(response.data, from, to);
    
    await axios.put(url, {})

    await axios.put(url,reorderedObj)
}
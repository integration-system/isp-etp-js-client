import EtpClient from "./client";
import {Options} from "./options";

function client(url: string, options?: Options): EtpClient {
    return new EtpClient(url, options)
}

export default client;

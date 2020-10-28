import { OctetString as AsnOctetString } from "asn1js";
import { IAsnConvertible } from "../types";
export declare class OctetString implements IAsnConvertible, ArrayBufferView {
    buffer: ArrayBuffer;
    get byteLength(): number;
    get byteOffset(): number;
    constructor();
    constructor(byteLength: number);
    constructor(bytes: number[]);
    constructor(bytes: BufferSource);
    fromASN(asn: any): this;
    toASN(): AsnOctetString;
    toSchema(name: string): AsnOctetString;
}

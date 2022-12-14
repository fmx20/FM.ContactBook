export class MD5 {

  private static rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
  }

  private static addUnsigned(lX: number, lY: number) {
    let lX4: number,
        lY4: number,
        lX8: number,
        lY8: number,
        lResult: number;

    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }

  private static F(x: number, y: number, z: number) { return (x & y) | ((~x) & z); }
  private static G(x: number, y: number, z: number) { return (x & z) | (y & (~z)); }
  private static H(x: number, y: number, z: number) { return (x ^ y ^ z); }
  private static I(x: number, y: number, z: number) { return (y ^ (x | (~z))); }

  private static FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.F(b, c, d), x), ac));
    return this.addUnsigned(this.rotateLeft(a, s), b);
  };

  private static GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.G(b, c, d), x), ac));
    return this.addUnsigned(this.rotateLeft(a, s), b);
  };

  private static HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.H(b, c, d), x), ac));
    return this.addUnsigned(this.rotateLeft(a, s), b);
  };

  private static II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.I(b, c, d), x), ac));
    return this.addUnsigned(this.rotateLeft(a, s), b);
  };

  private static convertToWordArray(string: string) {
    let lWordCount: number;
    let lMessageLength = string.length;
    let lNumberOfWords_temp1 = lMessageLength + 8;
    let lNumberOfWords_temp2 = (lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
    let lNumberOfWords = (lNumberOfWords_temp2+1)*16;
    let lWordArray = Array(lNumberOfWords-1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while ( lByteCount < lMessageLength ) {
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount-(lByteCount % 4))/4;
    lBytePosition = (lByteCount % 4)*8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
    lWordArray[lNumberOfWords-2] = lMessageLength<<3;
    lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
    return lWordArray;
  };

  private static wordToHex(lValue: number) {
    let WordToHexValue = "",
        WordToHexValue_temp = "",
        lByte: number,
        lCount: number;
    for (lCount = 0;lCount<=3;lCount++) {
      lByte = (lValue>>>(lCount*8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
    }
    return WordToHexValue;
  };

  private static utf8Encode(string: string) {
    string = string.replace(/\r\n/g,"\n");
    let utftext = "";

    for (let n = 0; n < string.length; n++) {

      let c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  };

  static Compute(value: string): string {
    let x = Array();

    let k: number,
        AA: number,
        BB: number,
        CC: number,
        DD: number,
        a: number,
        b: number,
        c: number,
        d: number;

    let S11 = 7, 
        S12 = 12, 
        S13 = 17,  
        S14 = 22;
    let S21 = 5, 
        S22 = 9, 
        S23 = 14,
        S24 = 20;
    let S31 = 4, 
        S32 = 11, 
        S33 = 16, 
        S34 = 23;
    let S41 = 6, 
        S42 = 10, 
        S43 = 15, 
        S44 = 21;
  
    value = this.utf8Encode(value);
  
    x = this.convertToWordArray(value);
  
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  
    for (k = 0; k < x.length; k += 16) {
      AA = a; 
      BB = b; 
      CC = c; 
      DD = d;
      a=this.FF(a,b,c,d,x[k+0], S11,0xD76AA478);
      d=this.FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
      c=this.FF(c,d,a,b,x[k+2], S13,0x242070DB);
      b=this.FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
      a=this.FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
      d=this.FF(d,a,b,c,x[k+5], S12,0x4787C62A);
      c=this.FF(c,d,a,b,x[k+6], S13,0xA8304613);
      b=this.FF(b,c,d,a,x[k+7], S14,0xFD469501);
      a=this.FF(a,b,c,d,x[k+8], S11,0x698098D8);
      d=this.FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
      c=this.FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
      b=this.FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
      a=this.FF(a,b,c,d,x[k+12],S11,0x6B901122);
      d=this.FF(d,a,b,c,x[k+13],S12,0xFD987193);
      c=this.FF(c,d,a,b,x[k+14],S13,0xA679438E);
      b=this.FF(b,c,d,a,x[k+15],S14,0x49B40821);
      a=this.GG(a,b,c,d,x[k+1], S21,0xF61E2562);
      d=this.GG(d,a,b,c,x[k+6], S22,0xC040B340);
      c=this.GG(c,d,a,b,x[k+11],S23,0x265E5A51);
      b=this.GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
      a=this.GG(a,b,c,d,x[k+5], S21,0xD62F105D);
      d=this.GG(d,a,b,c,x[k+10],S22,0x2441453);
      c=this.GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
      b=this.GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
      a=this.GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
      d=this.GG(d,a,b,c,x[k+14],S22,0xC33707D6);
      c=this.GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
      b=this.GG(b,c,d,a,x[k+8], S24,0x455A14ED);
      a=this.GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
      d=this.GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
      c=this.GG(c,d,a,b,x[k+7], S23,0x676F02D9);
      b=this.GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
      a=this.HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
      d=this.HH(d,a,b,c,x[k+8], S32,0x8771F681);
      c=this.HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
      b=this.HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
      a=this.HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
      d=this.HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
      c=this.HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
      b=this.HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
      a=this.HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
      d=this.HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
      c=this.HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
      b=this.HH(b,c,d,a,x[k+6], S34,0x4881D05);
      a=this.HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
      d=this.HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
      c=this.HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
      b=this.HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
      a=this.II(a,b,c,d,x[k+0], S41,0xF4292244);
      d=this.II(d,a,b,c,x[k+7], S42,0x432AFF97);
      c=this.II(c,d,a,b,x[k+14],S43,0xAB9423A7);
      b=this.II(b,c,d,a,x[k+5], S44,0xFC93A039);
      a=this.II(a,b,c,d,x[k+12],S41,0x655B59C3);
      d=this.II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
      c=this.II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
      b=this.II(b,c,d,a,x[k+1], S44,0x85845DD1);
      a=this.II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
      d=this.II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
      c=this.II(c,d,a,b,x[k+6], S43,0xA3014314);
      b=this.II(b,c,d,a,x[k+13],S44,0x4E0811A1);
      a=this.II(a,b,c,d,x[k+4], S41,0xF7537E82);
      d=this.II(d,a,b,c,x[k+11],S42,0xBD3AF235);
      c=this.II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
      b=this.II(b,c,d,a,x[k+9], S44,0xEB86D391);
      a=this.addUnsigned(a,AA);
      b=this.addUnsigned(b,BB);
      c=this.addUnsigned(c,CC);
      d=this.addUnsigned(d,DD);
    }

    let temp = this.wordToHex(a) + this.wordToHex(b) + this.wordToHex(c) + this.wordToHex(d);

    return temp.toLowerCase();
  }

}
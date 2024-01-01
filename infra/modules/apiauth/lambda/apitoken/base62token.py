
#!/usr/bin/python3
#
#

import secrets
import binascii

DEFAULT_DICTIONARY = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
CHECKSUM_LEN = 6


class Base62Token:

    """
        # Base62 Token Spec

        ## GitHub Token Breakdown

        The 40-character tokens are broken down into 3 consecutive parts:

        `pre_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcccccc`

        - **Prefix**: 4-char (ex: `ghx_`)
        - **Entropy**: 30-char (178-bits + leading 0 padding)
        - `BITS_PER_CHAR = Math.log(62) / Math.log(2) // about 5.9541`
        - `BITS_PER_CHAR * 30 // about 178.6258`
        - **Checksum**: 6-char CRC32 (32-bits, 4 bytes, 6 base62 characters)
        - (of entropy-only, not prefix)
        - `BITS_PER_CHAR * 5 // about 35.7251`

        | Prefix | Entropy                        | Checksum |
        | -----: | :----------------------------- | :------- |
        |  pre\_ | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx | cccccc   |

        See

        - https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/
        - https://github.blog/changelog/2021-09-23-npm-has-a-new-access-token-format/


        Go Pseudo code:

            const DICT = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            const PREFIX_LEN = 4
            const CHECKSUM_LEN = 6

            func GenerateBase62Token(prefix string, len int) string {
                entropy := []string{}
                for 0..len {
                    index := math.RandomInt(62) // 0..61
                    char := DICT[index]
                    entropy = append(entropy, char)
                }
                chksum := crc32.Checksum(entropy) // uint32

                pad := CHECKSUM_LEN
                chksum62 := base62.Encode(DICT, chksum, pad)

                // ex: "ghp_" + "zQWBuTSOoRi4A9spHcVY5ncnsDkxkJ" + "0mLq17"
                return prefix + string(entropy) + chksum62
            }

            func VerifyBase62Token(token string) bool {
                // prefix is not used
                entropy := token[PREFIX_LEN:len(token)-CHECKSUM_LEN]
                chksum := base62.Decode(DICT, token[len(token)-CHECKSUM_LEN:]) // uint32

                return crc32.Checksum(entropy) == chksum
            }
    """

    def __init__(self, dictionary: str = DEFAULT_DICTIONARY):
        """
        """
        self.dictionary = dictionary

        return

    def generate(self, prefix: str, length: int = 30) -> str:
        entropy = ''.join(
            secrets.choice(self.dictionary) for i in range(length)
        )

        chksum62 = self._checksum(entropy)

        return prefix + "_" + entropy + chksum62

    def _b62_encode(self, s: int, minlen=CHECKSUM_LEN) -> str:
        encoded = ""
        while s > 0:
            s, remainder = divmod(s, 62)
            encoded = self.dictionary[remainder] + encoded
        return encoded.rjust(minlen, self.dictionary[0])

    def _checksum(self, data: str) -> str:

        crc = binascii.crc32(data.encode("utf-8"))

        return self._b62_encode(crc)

    def verify(self, token: str) -> bool:

        # everything before the _ is the prefix
        index = token.find("_")

        # then everything upto CHECKSUM_LEN chars is the random entropy
        entropy = token[index+1:-CHECKSUM_LEN]

        # the remaining CHECKSUM_LEN chars are the checksum
        crc = token[-CHECKSUM_LEN:]

        chksum62 = self._checksum(entropy)

        return chksum62 == crc


if __name__ == '__main__':
    token = Base62Token()
    generated = token.generate("adp")
    print(generated)
    result = token.verify(generated)
    print(result)

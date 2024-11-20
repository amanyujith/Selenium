import generateRandomNumber from "./generateRandomNumber";

class HoolvaUtils {
    static generatePassword(lenth: number = 8, minUpper: number = 0, minLower: number = 0, minNumber: number = 0, minSpecial: number = 0): string {
        let chars = String.fromCharCode(...Array(127).keys()).slice(33),//chars
            A2Z = String.fromCharCode(...Array(91).keys()).slice(65),//A-Z
            a2z = String.fromCharCode(...Array(123).keys()).slice(97),//a-z
            zero2nine = String.fromCharCode(...Array(58).keys()).slice(48),//0-9
            specials = chars.replace(/\w/g, '');
        if (minSpecial < 0) chars = zero2nine + A2Z + a2z
        if (minNumber < 0) chars = chars.replace(zero2nine, '')
        let minRequired = minSpecial + minUpper + minLower + minNumber
        let rs = [].concat(
            //@ts-ignore
            Array.from({length: minSpecial ? minSpecial : 0}, () => specials[Math.floor(generateRandomNumber() * specials.length)]),
            Array.from({length: minUpper ? minUpper : 0}, () => A2Z[Math.floor(generateRandomNumber() * A2Z.length)]),
            Array.from({length: minLower ? minLower : 0}, () => a2z[Math.floor(generateRandomNumber() * a2z.length)]),
            Array.from({length: minNumber ? minNumber : 0}, () => zero2nine[Math.floor(generateRandomNumber() * zero2nine.length)]),
            Array.from({length: Math.max(lenth, minRequired) - (minRequired ? minRequired : 0)}, () => chars[Math.floor(generateRandomNumber() * chars.length)]),
        )
        //@ts-ignore
        const password =  rs.sort(() => generateRandomNumber()).join('');
        const passwordArr = password.split('');
        passwordArr.sort(function() {
            return 0.5 - generateRandomNumber();
        });  
        return passwordArr.join('');      
    }
   
}
export default HoolvaUtils;
export const toObject = (jsonString)=>{
    try {
        const jsonObject = JSON.parse(jsonString);
        return jsonObject;
    } catch(err) {
        return jsonString;
    }
};
// export const toObject = (jsonString)=>{
//     return new Promise((resolve,reject)=>{
//         try {
//             const jsonObject = JSON.parse(jsonString);
//             resolve({
//                 message: '[Done]',
//                 result: jsonObject
//             });
//         } catch(err) {
//             reject({
//                 message: '[Fail] Invalid json string',
//                 result: null,
//             });
//         }
//     });
// };

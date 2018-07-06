import InitJWTManager from'../JWTManager';
const JWTManager = InitJWTManager();

/**
 * Generate & Verify Token Test
 */
test.skip('Generate & Verify Token', async ()=>{
    const originData = {
        userName: 'Paul An',
        userContact: 'anpaul0615@gmail.com'
    };
    
    try {
        // 1) 토큰생성
        const token = await JWTManager.create(originData);

        // 2) 토큰 확인
        const tokenData = await JWTManager.verify(token);

        // fin) 최종확인
        expect(tokenData.userName).toBe(originData.userName);
        expect(tokenData.userContact).toBe(originData.userContact);
        // console.log('token ::', token);
        // console.log('tokenData ::', tokenData);

    } catch(err) {
        console.log(err);
    }
});
"use server"
import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_KEY,
    },
});

export const sendEmail = async (email: any, content: string) => {
   
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: '[Coope] 문의 주신 내용에 대한 답변드립니다',
        html: `
    <div style='
      text-align: center; 
      width: 50%; 
      height: 60%;
      margin: 15%;
      padding: 20px;
      box-shadow: 1px 1px 3px 0px #999;
      '><h2>${content}</h2><br/>
      <h4>전송된 답변은 고객지원 > 자주묻는질문 > 1:1문의 > 문의내역 의 각 문의내에서도 확인이 가능합니다.</h4></div>`,
    };

    try {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            } else {
                console.info("Email sent: " + info.response);
            }
        });

        return { message: "이메일 전송 성공" };
    } catch (error) {
        console.error(error);
    }
};
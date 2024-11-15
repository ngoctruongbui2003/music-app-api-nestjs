import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RegisterMailDto } from './dto';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    testMail() {
        this.mailerService
        .sendMail({
            to: 'ngoctruongbuii2003@gmail.com', // list of receivers
            subject: 'TEST', // Subject line
            text: 'TEST', // plaintext body
            html: '<b>TEST</b>', // HTML body content
        })
        .then(() => {})
        .catch(() => {});
    }

    registerMail(registerMailDto: RegisterMailDto) {
        this.mailerService
        .sendMail({
            to: registerMailDto.email,
            subject: 'TEST Welcome to Spotify FAKE! THANK YOU LETTER',
            template: './register.hbs',
            context: {
                name: registerMailDto.display_name,
                email: registerMailDto.email,
            }
        })
        .then(() => {})
        .catch(() => {});
    }
}

import { IsNotEmpty, IsEmail, Matches } from 'class-validator'
import { MessagesHelper } from 'src/helpers/messages.helper'
import { RegExHelper } from 'src/helpers/regex.helper'

export class CreateUserDto {
	@IsNotEmpty()
	name: string

	@IsNotEmpty()
	@IsEmail()
	email: string

	@Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID })
	@IsNotEmpty()
	password: string

	@IsNotEmpty()
	dateBirth: string

	@IsNotEmpty()
	phone: string
}

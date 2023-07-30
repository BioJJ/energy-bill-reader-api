import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = this.userRepository.create(createUserDto)

		return await this.userRepository.save(user)
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const user = await this.findOne(id)

		this.userRepository.merge(user, updateUserDto)
		await this.userRepository.save(user)
	}

	async findAll(): Promise<User[]> {
		return await this.userRepository.find({
			select: ['id', 'name', 'email', 'dateBirth', 'phone'],
			where: { status: true }
		})
	}

	async findOne(id: number): Promise<User> {
		const User = await this.userRepository.findOneOrFail({
			select: ['id', 'name', 'email', 'dateBirth', 'phone'],
			where: { id }
		})

		if (!id) {
			throw new NotFoundException(`Não achei um User com o id ${id}`)
		}
		return User
	}

	async findEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOneOrFail({
			select: ['id', 'name', 'email', 'status', 'password'],
			where: { email }
		})

		if (!user) {
			throw new NotFoundException(`Não achei um usuario com o Email ${user}`)
		}
		return user
	}
	async remove(id: number): Promise<void> {
		await this.findOne(id)

		if (!id) {
			throw new NotFoundException(`Não achei um User com o id ${id}`)
		}
		this.userRepository.softDelete({ id })
	}
}

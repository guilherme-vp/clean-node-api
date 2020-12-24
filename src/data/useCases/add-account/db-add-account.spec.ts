import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
	sut: DbAddAccount
	encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt({ value }: { value: string }): Promise<string> {
			return new Promise(resolve => resolve('hashed_password'))
		}
	}
	return new EncrypterStub()
}

const makeSut = (): SutTypes => {
	const encrypterStub = makeEncrypter()
	const sut = new DbAddAccount({ encrypter: encrypterStub })
	return {
		sut,
		encrypterStub
	}
}

describe('DbAddAccount Usecase', () => {
	test('Sould call Encrypter with correct password', async () => {
		const { sut, encrypterStub } = makeSut()
		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password'
		}
		await sut.add(accountData)
		expect(encryptSpy).toHaveBeenCalledWith({ value: 'valid_password' })
	})

	test('Sould throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut()
		jest
			.spyOn(encrypterStub, 'encrypt')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password'
		}
		const promise = sut.add(accountData)
		expect(promise).rejects.toThrow()
	})
})
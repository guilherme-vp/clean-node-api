import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-params-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
	handle(httpRequest: HttpRequest): HttpResponse {
		const requiredFiels = ['name', 'email']

		for (const field of requiredFiels) {
			if (!httpRequest.body[field]) {
				return badRequest(new MissingParamError(field))
			}
		}

		return {
			statusCode: 200,
			body: 'Success'
		}
	}
}

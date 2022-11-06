import { handler } from './main'
import {expect} from '@jest/globals';



it("Should succeed when good receipt number", async () => {
    const result = await handler({receipt_number:"IOE0916878702"}, {})
    console.log(result)
    expect(result).toBeDefined()
})

it("Should fail when bad receipt number", async () => {
    const promise = handler({receipt_number:"IOEXYZ"}, {})
    await expect(promise).rejects.toThrow()
})
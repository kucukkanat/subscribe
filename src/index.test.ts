import { describe, it, expect, afterEach } from 'vitest'
import { Emitter } from './index'

// The two tests marked with concurrent will be run in parallel
describe('suite', () => {
    let eventbus = new Emitter<"login" | "register">()
    afterEach(() => {
        // Clear eventbus after each test
        eventbus = new Emitter()
    })
    it('Emitter starts with zero listeners', async () => {
        expect(eventbus.listeners).toEqual({})
    })
    it('Emitter can add a listener', async () => {
        eventbus.on("login", () => { })
        expect(eventbus.listeners).toEqual({ login: [expect.any(Function)] })
    })
    it('Emitter can add multiple listeners', async () => {
        eventbus.on("login", () => { })
        eventbus.on("login", () => { })
        expect(eventbus.listeners).toEqual({ login: [expect.any(Function), expect.any(Function)] })
    })
    it('Emitter can remove a listener', async () => {
        function firstListener() { /** DO something */ }
        function secondListener() { /** DO something */ }
        eventbus.on("login", firstListener)
        eventbus.on("login", secondListener)
        eventbus.off("login", firstListener)
        expect(eventbus.listeners).toEqual({ login: [expect.any(Function)] })
    })
    it('Emitter can remove all listeners', async () => {
        eventbus.on("login", () => { })
        eventbus.on("login", () => { })
        eventbus.off("login")
        expect(eventbus.listeners["login"]).toBeUndefined()
    })
    it('Emitter can emit an event', async () => {
        let called = false
        eventbus.on("login", () => { called = true })
        eventbus.emit("login")
        expect(called).toBeTruthy()
    })
    it('Emitter can emit an event with data', async () => {
        let called = false
        eventbus.on("login", (data: boolean) => { called = data })
        eventbus.emit("login", true)
        expect(called).toBeTruthy()
    })
    it('Emitter can catch all events with *', async () => {

        const EVENT_NAME = "login"
        eventbus.on("*", (type, data) => {
            expect(type).toBe(EVENT_NAME)
            expect(data).toBeTruthy()
        })
        eventbus.emit(EVENT_NAME, true)

    })

    it("Emitter fires only once", async () => {
        let called = 0
        eventbus.once("login", () => { called++ })
        eventbus.emit("login")
        eventbus.emit("login")
        expect(called).toBe(1)
    })

})

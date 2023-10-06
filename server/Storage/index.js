
// Imports: The log and date_diff_in_minute utility functions are imported from an external module.
const {log, date_diff_in_minute} = require('../utils');


/**
 * Storage System
 */
const STORAGE = new (class {
    constructor() {
        this.data = {}
        log("INITIATE STORAGE")
    }

    is_exists(id) {
        return Boolean(this.data[id]);
    }

    generate_id() {
        return Math.random().toString(36).substring(4).slice(1, 7)
    }

    generate_pwd() {
        return Math.random().toString(36).substring(4).slice(1, 5)
    }

    request_slot() {
        let id = this.generate_id()
        while (this.is_exists(id)) id = this.generate_id()
        const pwd = this.generate_pwd()
        this.data[id] = {pwd, reserved_time: new Date()}
        log("SLOT RESERVED", `ID:${id}`, `PWD:${pwd}`)
        return {id, pwd}
    }

    read(id) {
        if (this.is_exists(id)) {
            const slot = this.data[id]
            if (slot.updated_time) {
                log("READ SLOT", `ID:${id}`)
                return slot.data
            }
        }
        return null
    }

    save(id, pwd, data) {
        if (this.is_exists(id)) {
            const slot = this.data[id]
            // check password
            if (slot.pwd === pwd) {
                this.data[id].data = data
                this.data[id].updated_time = new Date()
                log("SLOT UPDATED", `ID:${id}`)
                return true
            } else {
                return false
            }
        } else {
            const now = new Date()
            this.data[id] = {id, pwd, data, reserved_time: now, updated_time: now}
            log("SLOT CREATED", `ID:${id}`)
            return true
        }
    }

    clean_older_slots = () => {
        const current_time = new Date()

        for (let slot_key of Object.keys(this.data)) {
            const slot = this.data[slot_key]
            if (
                (slot.updated_time && (date_diff_in_minute(slot.updated_time, slot.reserved_time) > 10)) ||
                (!slot.updated_time && (date_diff_in_minute(current_time, slot.reserved_time) > 5))
            ) {
                log("REMOVING SLOT", slot_key)
                delete this.data[slot_key]
            }
        }

        log("IN MEMORY REPORT", String(Object.keys(this.data)))
    }

});

// Exports: The instantiated STORAGE object is exported, which means other modules can require and use this object.
module.exports = STORAGE;
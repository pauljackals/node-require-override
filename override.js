console.log('module "override.js" loaded')

const { Module } = require("module")

const requireOverride = [
    [
        /\/utils$/,
        {
            getHostname: () => "OVERRIDE"
        }
    ]
]

const requireOriginal = Module.prototype.require
Module.prototype.require = function() {
    const arg = arguments[0]
    return !/\/node_modules\//.test(this.id) && /\.\//.test(arg)
        && requireOverride.find(x => x[0].test(arg))?.[1]
        || requireOriginal.apply(this, arguments)
}

requireOriginal("./index")

Module.prototype.require = requireOriginal

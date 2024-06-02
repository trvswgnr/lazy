// @ts-check
import { readFileSync, writeFileSync } from "fs";

const CONFIG_PATH = "./jsr.json";

/**
 * @type {Config}
 */
const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));

const SEMVER_REGEX =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

// increment the version
config.version = config.version.replace(
    SEMVER_REGEX,
    (
        /** @type {string} */ _,
        /** @type {string} */ major,
        /** @type {string} */ minor,
        /** @type {string} */ patch,
    ) => {
        return `${major}.${minor}.${parseInt(patch) + 1}`;
    },
);

writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

/**
 * @typedef {Object} Config
 * @property {string} version The version of this JSR package.
 * @property {Object.<string, string> | string} exports A JSON representation of exports in a JSR configuration file.
 * @property {string} name The name of this JSR package. Must be scoped.
 * @property {Publish} [publish] Optional publishing details.
 */

/**
 * @typedef {Object} Publish
 * @property {string[]} [exclude] List of files, directories, or globs that will be excluded from the published package.
 * @property {string[]} [include] List of files, directories, or globs that will be included in the published package.
 */

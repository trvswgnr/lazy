// @ts-check
import { readFileSync, writeFileSync } from "fs";

/**
 * @type {PackageJson}
 */
const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

const SEMVER_REGEX =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

// increment the version
packageJson.version = packageJson.version.replace(
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

writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));

/**
 * @typedef {{
 *     version: string;
 * }} PackageJson
 */

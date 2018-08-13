import {vsprintf} from 'sprintf-js'

export default class I18n {

    /**
     * Create a new instance of the I18n class
     * @param {object} config
     * @param {string} config.language - Local language to apply
     * @param {string} config.path - Path on the server to access language files
     * @param {string} config.extension - Language files extension
     * @param {boolean} config.setGlobal - Set the function __ as a globally accessible variable
     * @param {function} config.onReady - Callback triggered when the datafile are gathered
     * @param {boolean} config.verbose - Disable/enable console logging
     */
    constructor(config) {
        this._parseConfig(config);
        this._setGlobal();
        this._setVerbosity();
        this._getFileFromServer();

        this.callbacks = [];
    }

    /**
     * @param config
     * @private
     */
    _parseConfig(config) {
        this.config = {
            language: config.language || 'en',
            path: config.path || '/locales',
            extension: config.extension || '.json',
            setGlobal: config.setGlobal || true,
            onReady: config.onReady || function () {},
            verbose: config.verbose || true
        };
    }

    /**
     * Retrieve file from server
     * @private
     */
    _getFileFromServer() {
        $.ajax({
            url: this.config.path + '/' + this.config.language + this.config.extension,
            dataType: 'json',
            async: false,
            success: this._onSuccess.bind(this),
            error: this._onError.bind(this)
        })
    }

    /**
     * Set the function __ on a global scope
     * @private
     */
    _setGlobal() {
        if (this.config.setGlobal) {
            window.__ = this.__.bind(this);
        }
    }

    /**
     * Set the logger for the given verbosity
     * @private
     */
    _setVerbosity() {
        this._logger = {
            info: () => {},
            error: () => {},
            warn: () => {},
            log: () => {}
        };

        if(this.config.verbose){
            this._logger = {
                info: console.info,
                error: console.error,
                warn: console.warn,
                log: console.log
            }
        }
    }

    /**
     * Datafile successfully gathered from the server
     * @param data
     * @private
     */
    _onSuccess(data) {
        this._logger.info('[browser-i18n] File loaded successfully.');

        this.localeFile = data;
        this.config.onReady(data);
    }

    /**
     * Error while retrieving datafile from server
     * @private
     */
    _onError() {
        const path = this.config.path + '/' + this.config.language + this.config.extension;
        this._logger.error('[browser-i18n] Cannot get the file ' + path);

        if(this.config.language !== 'en'){
            this._logger.log('[browser-i18n] Trying to fall back to english.');
            
            this.config.language = 'en';
            this._getFileFromServer();
        }
    }

    /**
     * Get a translation
     * @param {string} text
     * @param {string} [args] - Optional arguments
     * @returns {string}
     */
    __(text) {
        let textTranslated = this.localeFile[text];

        if(textTranslated === undefined){
        	this._logger.log(`Missing translation in '${this.config.language + this.config.extension}', add:\n"${text}": "${text}"`)
        }

        if (arguments.length > 1) {
            textTranslated = vsprintf(textTranslated, Array.prototype.slice.call(arguments, 1));
        }

        return textTranslated;
    }
};
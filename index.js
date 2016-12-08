var q = require('q');

const STRICT_DI_REGEX = /\[\$injector:strictdi\]\s(\w*?)\s/;

exports.name = 'ngStrictDiPlugin';

exports.postTest = function() {
    var deferred = q.defer();
    browser.manage().logs().get('browser')
        .then(
            log => {
                return log.filter(
                    (node) => node.message.indexOf('$injector:strictdi') !== -1
                );
            })
        .then(
            errors => {
                errors.forEach((err) => {
                    var component = STRICT_DI_REGEX.exec(err.message);
                    this.addFailure(
                        component[1],
                        {
                            specName: 'Missing ngInject'
                        }
                    );
                });
                deferred.resolve();
            }
        );
    return deferred.promise;
};


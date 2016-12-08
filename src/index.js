import 'babel-polyfill';
import q from 'q';


class NgStrictDiPlugin {

    constructor() {
        this.name = 'ngStrictDiPlugin';
        this.ngStrictDiRegex = /\[\$injector:strictdi\]\s(\w*?)\s/;
    }

    postTest() {
        var deferred = q.defer();
        browser.manage()
               .logs()
               .get('browser')
               .then(logs => {
                   var errors = this.filterLogs(logs);
                   if (errors.length) {
                       this.reportErrors(errors);
                   }
                   deferred.resolve();
               });
        return deferred.promise;
    }

    /*
     * Filter the logs and return any injection
     * error entries.
     */
    filterLogs(logs) {
        return logs.filter(x => x.message.includes('$injector:strictdi'));
    }

    /*
     * Process errors and call addFailure() for
     * each ngStrictDi message found.
     */
    reportErrors(errors) {
        for(let error of errors) {
            var componentName = this.ngStrictDiRegex.exec(error.message)[1];
            this.addFailure(componentName, {
                specName: 'NgStrictDiPlugin'
            });
        }
    }

}

module.exports = new NgStrictDiPlugin();

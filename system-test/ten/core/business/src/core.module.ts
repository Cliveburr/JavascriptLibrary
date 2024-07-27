import { Module } from 'providerjs';
import { CORE_ALL_BUSINESS, CORE_ALL_SERVICE, SecurityModels } from './business';
import { CORE_ALL_DATAACCESS } from './dataaccess';
import { BusinessProvider, DataAccessProvider } from '@ten/framework_business';
import { CoreSecurityDomain } from './security/core-security';

const businessProvider = new BusinessProvider('core', CORE_ALL_BUSINESS);
const dataaccessProvider = new DataAccessProvider('core', CORE_ALL_DATAACCESS);
SecurityModels['core'] = CoreSecurityDomain;

@Module({
    providers: [businessProvider, CORE_ALL_SERVICE, dataaccessProvider],
    exports: [businessProvider, CORE_ALL_SERVICE]
})
export class CoreModule {

}

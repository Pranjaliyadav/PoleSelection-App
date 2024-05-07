//module definition for integrating Redis into a NestJS application asynchronously
//when you need to fetch configuration options async such as form envirnoment variable or external sources
import { DynamicModule, FactoryProvider, Module, ModuleMetadata } from "@nestjs/common";
import IORedis, { Redis, RedisOptions } from "ioredis"; //all these to interact with Redis


export const IORedisKey = 'IORedis' //key to identify Redis Provider

//RedisAsyncModuleOptions to mirror the structure of a regular NestJS module definition.
//optiosn that can be provided when configuring redis module
type RedisModuleOptions = {
    connectionOptions: RedisOptions; //optiosn for connecting to reddis server
    onClientReady?: (client: Redis) => void; //optional callback fn called when redis client is ready
}

//options for async configuring the redis module
type RedisAsyncModuleOptions = {
    useFactory: (
        ...args: any[]
    ) => Promise<RedisModuleOptions> | RedisModuleOptions

} & Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider, 'inject'> //including fields for imports and inject similar to what a regular NestJS module definition would include
//Pick is a type definition uses in Typescript's utitlity type to select specific fields fro the ModuleMetaData interface provided by NestJS
//Here, it picks the 'imports' field, which represents an array of modules that should be imported into the module using these options
//The 'inject' field represents an array of tokens representing dependencies that should be injected into the factory function

@Module({})
export class RedisModule {
    //method for async registering the redis module
    static async registerAsync({
        useFactory,
        imports, inject
    }: RedisAsyncModuleOptions): Promise<DynamicModule> {
        const redisProvider = {
            provide : IORedisKey,
            //provider
            useFactory : async (...args) => {
                const {connectionOptions, onClientReady} = await useFactory(...args)
                const client = await new IORedis(connectionOptions) //creting instance of IORedis with provided connection options
                onClientReady(client)
                return client
            },
            inject,
        }

        //returning module with redis provider, speciifying imports providers and exports
        return {
            module: RedisModule,
            imports,
            providers: [redisProvider],
            exports: [redisProvider],
        }
    }
}
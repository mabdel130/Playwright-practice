export type User = {
    email: string;
    password: string;
};

const person = {
    firstName: "Mohamed",
    lastName: "Abdo",
    age: 30,
    gender: "male"
};

console.log(`Hello, ${person.firstName} ${person.lastName}!`);
console.log(person.firstName, person.lastName, person.age);
person.firstName="Ahmed";
person.gender="unknown";
console.log(`Hello, ${person.firstName} ${person.lastName}!`);
console.log(person.gender);

type crediationals = {
    username: string;
    password: string;
    gender: string;
    email: string;
    mobile: unknown;
};
const admin: crediationals = {
    username: "admin",
    password: "admin123",
    gender: "male",
    email: "moha@test.com",
    mobile: 123343334454,

};
function defineUser(admin: crediationals): unknown {
    return `Username: ${admin.username}, Password: ${admin.password}, Gender: ${admin.gender}, Email: ${admin.email}, Mobile: ${admin.mobile}`;
}
console.log(defineUser(admin));
console.log(admin.username, admin.password, admin.gender, admin.email);
console.log(`Username: ${admin.username}
Password: ${admin.password},
Gender: ${admin.gender},
Email: ${admin.email},
Mobile: ${admin.mobile}`);

type Environment = {
    baseURL: string;
    username: string;
    password: string;
};

const environments: Record<string, Environment> = {
    dev: {
        baseURL: "https://dev.example.com",
        username: "dev_admin",
        password: "dev123",
    },
    qa: {
        baseURL: "https://qa.example.com",
        username: "qa_admin",
        password: "qa123",
    },
    staging: {
        baseURL: "https://staging.example.com",
        username: "staging_admin",
        password: "staging123",
    },
    prod: {
        baseURL: "https://example.com",
        username: "prod_admin",
        password: "prod123",
    },
};

const envKey = process.env.TEST_ENV ?? "staging"; 
const activeEnv = environments[envKey];

if (!activeEnv) {
    throw new Error(`Unknown environment: ${envKey}`);
}

console.log(`Running against: ${activeEnv.baseURL}`);

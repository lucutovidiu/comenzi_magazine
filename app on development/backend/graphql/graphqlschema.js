const { GraphQLString,
    GraphQLObjectType,
    GraphQLID,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLInputObjectType } = require('graphql');
var mysql = require('mysql');
const {
    YYYYMMDDhhmmss
} = require('./util/util')
var Promise = require('bluebird');

// let connecting = true;

let dbConfig = {
    // connectionLimit: 100,
    // debug: false,
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'comenzimagazinedb'
}

let connection = mysql.createConnection(dbConfig);
connection.connect();
onDisconnect();

getQuery = (query) => new Promise(async function (resolve, reject) {
    try {
        if (connection.state !== 'disconnected') {
            let result = await connection.query(query);
            resolve(result);
        } else {
            connection = mysql.createConnection(dbConfig);
            connection.connect();
            onDisconnect();
            let result = await connection.query(query);
            resolve(result);
        }
    } catch (err) {
        reject(err)
    }
})
getNewQuery = (query) => new Promise(function (resolve, reject) {
    connection = mysql.createConnection(dbConfig);
    connection.connect(function (err) {
        if (err) { console.log(err); reject("Bad Connection") }
        else {
            connection.query(query, function (result) {
                resolve(result);
            })
            console.log("connected to db")
            onDisconnect();
        }
    });
})

function onDisconnect() {
    connection.query = Promise.promisify(connection.query);
    connection.on("error", function (err) {
        console.log("disconected");
    })
}

const UtilizatoriType = new GraphQLObjectType({
    name: "Utilizatori",
    fields: () => ({
        id: { type: GraphQLID },
        nume_utilizator: { type: GraphQLString },
        locatie_utilizator: { type: GraphQLString },
        parola_utilizator: { type: GraphQLString },
        ultima_logare: { type: GraphQLString },
        comenzi: {
            type: new GraphQLList(ComenziType),
            resolve(parent, args) {

                return getQuery("select * from comenzi where id_utilizator='" + parent.id + "'")
                    .then((result) => {
                        return result.map(item => ({
                            ...item,
                            data_comanda: "" + item.data_comanda
                        }))
                    });
            }
        }
    })
})

const ArticoleType = new GraphQLObjectType({
    name: "Articole",
    fields: () => ({
        id: { type: GraphQLID },
        nume_articol: { type: GraphQLString },
        cantitate_stoc: { type: GraphQLInt },
        pret: { type: GraphQLFloat },
        status: { type: GraphQLString }
    })
})

const ComenziType = new GraphQLObjectType({
    name: "Comenzi",
    fields: () => ({
        nr_comanda: { type: GraphQLID },
        IDStare: {
            type: GraphQLString,
            resolve(parent, args) {

                //console.log(parent.IDStare);
                return getQuery("select * from stare_comenzi where id='" + parent.IDStare + "'")
                    .then((result) => result[0].nume_stare);
            }
        },
        utilizator: {
            type: UtilizatoriType,
            resolve(parent, args) {

                return getQuery("select * from utilizatori where id=" + parent.id_utilizator)
                    .then((result) => result[0]);
            }
        },
        data_comanda: { type: GraphQLString },
        detalii_comanda: {
            type: new GraphQLList(DetaliiComenziType),
            resolve(parent, args) {

                return getQuery("select * from detalii_comanda where id_comenzi='" + parent.nr_comanda + "'")
                    .then((result) => result);
            }
        }
    })
})

const DetaliiComenziType = new GraphQLObjectType({
    name: "DetaliiComenzi",
    fields: () => ({
        id_comenzi: { type: GraphQLID },
        articol: {
            type: ArticoleType,
            resolve(parent, args) {

                return getQuery("select * from articole where id='" + parent.id_articol + "'")
                    .then((result) => result[0]);
            }
        },
        cantitate: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        utilizator: {
            type: new GraphQLNonNull(UtilizatoriType),
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return getQuery("select * from utilizatori where id=" + args.id)
                    .then((result) => {
                        return {
                            ...result[0],
                            ultima_logare: "" + result[0].ultima_logare
                        }
                    });
            }
        },
        utilizatori: {
            type: new GraphQLNonNull(new GraphQLList(UtilizatoriType)),
            resolve(parent, args) {
                return getQuery("select * from utilizatori")
                    .then((result) => {
                        // console.log(result)
                        return result.map(item => {
                            return {
                                ...item,
                                ultima_logare: "" + item.ultima_logare
                            }
                        })
                    });
            }
        },
        login: {
            type: UtilizatoriType,
            args: { nume: { type: GraphQLString }, parola_utilizator: { type: GraphQLString } },
            resolve(parent, args) {
                let sql = "select * from utilizatori where nume_utilizator='" + args.nume + "' and parola_utilizator = '" + args.parola_utilizator + "'";
                // console.log(sql);
                return getQuery(sql)
                    .then(async (result) => {
                        // console.log(result[0]);
                        if (typeof result[0] !== undefined) {
                            sql = `update utilizatori set ultima_logare="${YYYYMMDDhhmmss(new Date())}" where id=${result[0].id}`;
                            //console.log(sql);
                            await getQuery(sql);
                        } else new Error("User sau Parola Gresite!");
                        //console.log(result[0]);
                        return { ...result[0], ultima_logare: YYYYMMDDhhmmss(result[0].ultima_logare) };
                    }).catch(err => {
                        console.log("login err: ", err)
                    });
            }
        },
        articol: {
            type: new GraphQLNonNull(ArticoleType),
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {

                return getQuery("select * from articole where id='" + args.id + "'")
                    .then((result) => result[0]);
            }
        },
        articole: {
            type: new GraphQLNonNull(new GraphQLList(ArticoleType)),
            resolve(parent, args) {

                return getQuery("select * from articole")
                    .then((result) => result);
            }
        },
        comenzi: {
            type: new GraphQLNonNull(new GraphQLList(ComenziType)),
            resolve(parent, args) {

                return getQuery("select * from comenzi order by data_comanda DESC")
                    .then((result) => result.map(item => ({
                        ...item,
                        data_comanda: "" + item.data_comanda
                    })));
            }
        },
        comanda: {
            type: new GraphQLNonNull(ComenziType),
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {

                return getQuery("select * from comenzi where nr_comanda='" + args.id + "' order by data_comanda DESC")
                    .then((result) => ({
                        ...result[0],
                        data_comanda: YYYYMMDDhhmmss(result[0].data_comanda)
                    }))
            }
        },
        comenzi_dupa_data: {
            type: new GraphQLNonNull(new GraphQLList(ComenziType)),
            args: { data_de_la: { type: GraphQLString }, data_pana_la: { type: GraphQLString } },
            resolve(parent, args) {

                return getQuery("select * from comenzi where DATE(data_comanda)>='" + args.data_de_la + "' and DATE(data_comanda) <= '" + args.data_pana_la + "' order by data_comanda DESC")
                    .then((result) => {

                        return result.map(item => ({
                            ...item,
                            data_comanda: "" + item.data_comanda
                        }))

                    });
            }
        },
        comenzi_dupa_data_si_utilizator: {
            type: new GraphQLNonNull(new GraphQLList(ComenziType)),
            args: {
                data_de_la: { type: GraphQLString }, data_pana_la: { type: GraphQLString }, utilizator: {

                    type: GraphQLString
                }
            },
            resolve(parent, args) {

                return getQuery("select * from comenzi where DATE(data_comanda)>='" + args.data_de_la + "' and DATE(data_comanda) <= '" + args.data_pana_la + "' and id_utilizator = '" + args.utilizator + "' order by data_comanda DESC")
                    .then((result) => {
                        return result.map(item => ({
                            ...item,
                            data_comanda: "" + item.data_comanda
                        }))
                    });
            }
        }
    }
})

let articoleInput = new GraphQLInputObjectType({
    name: "InputArticole",
    fields: {
        id_articol: { type: GraphQLID },
        cantitate: { type: GraphQLInt }
    }
})
let articoleNumeInput = new GraphQLInputObjectType({
    name: "InputArticoleNume",
    fields: {
        nume_articol: { type: GraphQLString },
        cantitate: { type: GraphQLString }
    }
})
let articolPretInput = new GraphQLInputObjectType({
    name: "InputArticolPret",
    fields: {
        nume_articol: { type: GraphQLString },
        cantitate_stoc: { type: GraphQLInt },
        pret_articol: { type: GraphQLFloat }
    }
})
let InputUtilizatori = new GraphQLInputObjectType({
    name: "InputUtilizatori",
    fields: {
        nume_utilizator: { type: GraphQLString },
        locatie_utilizator: { type: GraphQLString },
        parola_utilizator: { type: GraphQLString }
    }
})
let InputSchimbarePret = new GraphQLInputObjectType({
    name: "InputSchimbarePret",
    fields: {
        nume_articol: { type: GraphQLString },
        pret_articol: { type: GraphQLFloat }
    }
})

const Mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        adauga_articol: {
            type: ArticoleType,
            args: {
                nume_articol: { type: GraphQLString },
                cantitate_stoc: { type: GraphQLInt },
                pret: { type: GraphQLFloat }
            },
            resolve(parent, args) {
                let sql = "insert into articole(nume_articol,cantitate_stoc,pret) values('" + args.nume_articol +

                    "','" + args.cantitate_stoc + "'," + args.pret + ")"

                return getQuery(sql)
                    .then((result) => {
                        //console.log("select * from articole where id='" + result.insertId + "'");
                        return getQuery("select * from articole where id='" + result.insertId + "'")
                            .then((res) => res[0]);
                    })
            }
        },
        adauga_utilizator: {
            type: UtilizatoriType,
            args: {
                nume_utilizator: { type: GraphQLString },
                locatie_utilizator: { type: GraphQLString },
                parola_utilizator: { type: GraphQLString },
            },
            resolve(parent, args) {
                let sql = `insert into utilizatori(nume_utilizator,locatie_utilizator,parola_utilizator) values

("${args.nume_utilizator}","${args.locatie_utilizator}","${args.parola_utilizator}")`;

                return getQuery(sql)
                    .then((result) => {
                        //console.log("select * from utilizatori where id='" + result.insertId + "'");
                        return getQuery("select * from utilizatori where id='" + result.insertId + "'")
                            .then((res) => res[0]);
                    })
            }
        },
        modifica_preturi: {
            type: GraphQLInt,
            args: {
                lista_preturi: { type: GraphQLList(InputSchimbarePret) }
            },
            resolve(parent, { lista_preturi }) {

                lista_preturi.map(async ({ nume_articol, pret_articol }) => {
                    let sql = `update articole set pret=${pret_articol} where nume_articol="${nume_articol}"`;
                    res = await getQuery(sql)
                        .then(data => { finished = { loading: true, res: 1 } })
                        .catch(err => { finished = { loading: true, res: 2 } })
                });
                return 1
            }
        },
        adauga_utilizatori: {
            type: GraphQLInt,
            args: { utilizatori: { type: GraphQLList(InputUtilizatori) } },
            resolve(parent, { utilizatori }) {

                let finished = { loading: true, res: 1 }
                utilizatori.map(async ({ nume_utilizator, locatie_utilizator, parola_utilizator }) => {
                    let sql = `insert into utilizatori(nume_utilizator,locatie_utilizator,parola_utilizator) 

values("${nume_utilizator}","${locatie_utilizator}","${parola_utilizator}")`;
                    res = await getQuery(sql)
                        .then(data => { finished = { loading: true, res: 1 } })
                        .catch(err => { finished = { loading: true, res: 2 } })
                });
                return finished.res;
            }
        },
        adauga_comanda: {
            type: ComenziType,
            args: {
                id_utilizator: { type: GraphQLID },
                data_comanda: { type: GraphQLString },
                IDStare: { type: GraphQLID },
                lista_articole: { type: new GraphQLList(articoleInput) }
            },
            resolve(parent, { id_utilizator, data_comanda, lista_articole, IDStare }) {
                let sql = `insert into comenzi(id_utilizator,data_comanda,IDStare) values

(${id_utilizator},"${data_comanda}","${IDStare}")`;

                return getQuery(sql)
                    .then((result) => {
                        //console.log("select * from utilizatori where id='" + result.insertId + "'");
                        lista_articole.forEach(async ({ id_articol, cantitate }) => {
                            let sql = `insert into detalii_comanda(id_comenzi,id_articol,cantitate) values

(${result.insertId},${id_articol},"${cantitate}")`;
                            await getQuery(sql)
                                .catch(err => err);
                        });
                        let sql = `select * from comenzi where nr_comanda=${result.insertId}`;
                        return getQuery(sql)
                            .then((res) => res[0]);
                    })
            }
        },
        schimba_stare_comanda: {
            type: GraphQLID,
            args: {
                nr_comanda: { type: GraphQLID },
                stare_noua: { type: GraphQLString }
            },
            resolve(parent, { nr_comanda, stare_noua }) {

                let sql = `select id from stare_comenzi where nume_stare="${stare_noua}"`;
                return getQuery(sql)
                    .then((res) => {
                        // console.log(res);
                        let sql = `update comenzi set IDStare='${res[0].id}' where nr_comanda='${nr_comanda}'`;
                        // console.log(sql)
                        return getQuery(sql)
                            .then((result) => {
                                // console.log(result);
                                return nr_comanda;
                            })
                    });
            }
        },
        modifica_stoc_articole: {
            type: GraphQLID,
            args: {
                lista_articole: { type: new GraphQLList(articoleNumeInput) }
            },
            resolve(parent, { lista_articole }) {

                lista_articole.forEach(async ({ nume_articol, cantitate }) => {
                    let sql = `update articole set cantitate_stoc=${cantitate} where 

nume_articol="${nume_articol}"`;
                    // console.log(sql);
                    await getQuery(sql)
                        .catch(err => err);
                });
                return 1
            }
        },
        adauga_articole: {
            type: GraphQLID,
            args: {
                lista_articole: { type: new GraphQLList(articolPretInput) }
            },
            resolve(parent, { lista_articole }) {

                lista_articole.forEach(async ({ nume_articol, cantitate_stoc, pret_articol }) => {
                    let sql = `insert into articole (nume_articol,cantitate_stoc,pret,status) values("${new

                        String(nume_articol).toUpperCase()}",${cantitate_stoc},${pret_articol},"active")`;
                    // console.log(sql);
                    await getQuery(sql)
                        .catch(err => err);
                });
                return 1
            }
        },
        sterge_articole: {
            type: GraphQLID,
            args: {
                lista_articole: { type: new GraphQLList(GraphQLString) }
            },
            resolve(parent, { lista_articole }) {

                lista_articole.forEach(async (item) => {
                    let sql = `update articole set status="inactive" where nume_articol="${item}"`;
                    // console.log(sql);
                    await getQuery(sql)
                        .catch(err => { return err });
                });
                return 1
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})



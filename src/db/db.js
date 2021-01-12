import Sequilize from 'sequelize';

export const sequelize = new Sequilize(
    'coatichallenge',                    // db name
    'osmar',                    // user
    'Osmar,24',          // For AWS RDS Postgrtesql instance
    {
        host : 'db-coati-challenge.c7pv1aw1xwps.us-east-1.rds.amazonaws.com',
        dialect : 'postgres',
        pool : {
            max : 5,
            min : 0,
            require : 30000,
            idle : 10000
        },
        logging : false
    }
)
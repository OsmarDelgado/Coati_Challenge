import Role from '../models/Role';

export const createRoles = async () => {
    try {
        const count = await Role.findAndCountAll();

        if( count.count > 0 ) return;

        const values = await Promise.all( [
            Role.create( {
                name : "Admin"
            }, {
                fields : [ 'name' ]
            }),

            Role.create( {
                name : "User"
            }, {
                fields : [ 'name' ]
            })
        ] );

        console.log( values );

    } catch (error) {
        console.log(error);
    }
};
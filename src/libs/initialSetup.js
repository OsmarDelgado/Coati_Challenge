import Role from '../models/Role';

export const createRoles = async () => {
    try {
        const count = await Role.findAndCountAll();

        if( count.count > 0 ) return;

        const values = await Promise.all( [
            Role.create( {
                id : 1,
                name : "Admin"
            }, {
                fields : [ 'id', 'name' ]
            }),
            
            Role.create( {
                id : 2,
                name : "User"
            }, {
                fields : [ 'id', 'name' ]
            })
        ] );

        console.log( values );

    } catch (error) {
        console.log(error);
    }
};
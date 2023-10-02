const User = require('../../models/users')
async function user_info(req, res){
    const {user} = req;
    let {avatar, email, name, role, created_at} = await User.findOne({_id: user.id});
    let randome_spy = [{
        avatar: 'https://w7.pngwing.com/pngs/867/134/png-transparent-giant-panda-dog-cat-avatar-fox-animal-tag-mammal-animals-carnivoran-thumbnail.png',
        name: 'Cáo vui nhộn'
    }]
    if (role !== 1){
        let index_random = 0;
        avatar = randome_spy[index_random].avatar;
        name = randome_spy[index_random].name;
    }
    res.json({status: 1, data: {avatar, email, name, role, created_at}})
}

module.exports = user_info;
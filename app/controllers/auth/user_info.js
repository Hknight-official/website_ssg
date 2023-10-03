const User = require('../../models/users')
async function user_info(req, res){
    const {user} = req;
    let {_id:id, avatar, email, name, role, created_at} = await User.findOne({_id: user.id});
    let randome_spy = [
        {
            avatar: 'https://w7.pngwing.com/pngs/867/134/png-transparent-giant-panda-dog-cat-avatar-fox-animal-tag-mammal-animals-carnivoran-thumbnail.png',
            name: 'Cáo vui nhộn'
        },
        {
            avatar: 'https://e7.pngegg.com/pngimages/611/785/png-clipart-emoji-giant-panda-the-panda-coloring-pages-android-panda-avatar-mammal-face.png',
            name: 'Panda hài hước'
        },
        {
            avatar: 'https://cdn.icon-icons.com/icons2/1736/PNG/512/4043273-animal-avatar-mutton-sheep_113242.png',
            name: 'Cừu non nớt'
        },
        {
            avatar: 'https://www.svgrepo.com/show/420337/animal-avatar-bear.svg',
            name: 'Gấu can đảm'
        },
    ]
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    if (role !== 1){
        let index_random = getRandomInt(0, randome_spy.length-1);
        avatar = randome_spy[index_random].avatar;
        name = randome_spy[index_random].name;
    }
    res.json({status: 1, data: {id, avatar, email, name, role, created_at}})
}

module.exports = user_info;
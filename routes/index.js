var express = require('express');
var router = express.Router();
var advertising = require('../models/advertising');
var category = require('../models/category');
var province = require('../models/province');
var path = require('path');

/* GET home page. */
var myProvince = [];

province.find({}, function (err, data) {
    data.forEach(function (item) {
        myProvince = myProvince.concat(item.name);
    });
});
router.get('/favicon.ico', (req, res) =>
    res.status(204));
router.get('/', function (req, res, next) {
    if (req.session.province) {
        res.redirect(/province/ + req.session.province)
    } else {
        res.render('selectProvince', {
            title: 'Divar',
            myProvince: myProvince,
            auth: req.user,
            select: 'انتخاب استان'
        });
    }


});
/* GET speakers page. */
router.get('/new', function (req, res, next) {
    category.category(function (err, cg) {
        res.render('newAdvertising', {
            title: 'new',
            myProvince: myProvince,
            auth: req.user,
            cg: cg,
            select: req.session.province
        });
    });

});


const upload = require('../models/uploadMiddleware');
const Resize = require('../models/Resize');
router.post('/adver', upload.single('fileUploaded'), function (req, res) {
    var filename;
    if (!req.file) {
        // res.status(401).json({error: 'Please provide an image'});
        filename = undefined;
    } else {
        const imagePath = path.join('./public/img_adver');
        const fileUpload = new Resize(imagePath);
        filename = fileUpload.save(req.file.buffer);
    }

    // return res.status(200).json({ name: filename });
    function makeid(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    var newAdver = new advertising({
        type: req.body.type,
        firstName: req.body.firstName,
        email: req.body.email,
        swap: req.body.swap,
        province: req.body.province,
        price: req.body.price,
        titleAdver: req.body.titleAdver,
        img: filename,
        descriptionAdver: req.body.descriptionAdver,
        id: makeid(7),
        date: advertising.date(),
        category: req.body.category,
        username: req.user.username
    });
    advertising.createAdver(newAdver, function (err, adver) {
        if (err) throw err;
        console.log(adver);
    });
    console.log("uploaded");
    res.redirect('/');

});


router.get('/province/:Advertising/:Category?', function (req, res, next) {
    var limitedAdver = [];
    var allAdver = [];
    req.session.province = req.params.Advertising;
    advertising.finding(function (err, data) {
        data.forEach(function (item) {
            if (item.province === req.params.Advertising) {
                allAdver.push(item);
            }
        });
        category.category(function (err, cg) {
            var nameCategory = [];
            cg.forEach(function (nameCg) {
                nameCategory = nameCategory.concat(nameCg.name);
            });
            if (nameCategory.includes(req.params.Category)) {
                allAdver.forEach(function (adver) {
                    if (adver.category === req.params.Category) {
                        limitedAdver.push(adver);

                    }
                });
            } else {
                limitedAdver = allAdver;
            }
            if (myProvince.includes(req.params.Advertising)) {
                limitedAdver = limitedAdver.reduce(function (result, value, index, array) {
                    if (index % 6 === 0)
                        result.push(array.slice(index, index + 6));
                    return result;
                }, []);
                console.log(limitedAdver.length);
                global.limitedAdver = limitedAdver;
                res.render('index', {
                    title: 'اگهی' + ' ' + req.params.Advertising,
                    allPage: limitedAdver.length,
                    auth: req.user,
                    myProvince: myProvince,
                    cg: cg,
                    select: req.session.province,
                    myCategory:req.params.Category
                });
            } else {
                res.render('404');
                console.log(req.params.Advertising)
            }
        });
    });

});

router.post('/province/:Advertising/:Category?', function (req, res, next) {
    if (limitedAdver.length === 0){
        res.render('NotFoundAdver', {
            Text: 'not found'
        });
    }
    else {

        res.render('Advertising', {
            advers: limitedAdver[req.body._page]
        });
    }


});

router.get('/id/:id', function (req, res, next) {

    advertising.find({}, function (err, data) {
        var adverData;
        data.forEach(function (item) {
            if (item.id == req.params.id) {
                adverData = item;
            }
        });
        if (adverData === undefined) {
            res.render('404')
        } else {
            res.render('showAdvertising', {
                title: adverData.titleAdver,
                advers: adverData,
                auth: req.user,
                myProvince: myProvince,
                linkAdver: req.protocol + '://' + req.get('host') + req.originalUrl,
                select: req.session.province
            });
        }

    });
});
router.get('/my-divar/my-post', function (req, res, next) {
    advertising.getAdverByUsername(req.user.username, function (err, adver) {
        console.log(adver);
        res.render('myDivar', {
            title: 'دیوار من',
            page: 'myPost',
            auth: req.user,
            myProvince: myProvince,
            select: req.session.province,
            advers: adver
        });
    });

});
router.get('/my-divar/my-bookmark', function (req, res, next) {

    var bookmarks = req.user.bookmark;
    Promise.all(bookmarks.map(id => {
        return advertising.findOne({id: id}).exec();
    })).then(foundAdvers => {
        // all found riders here
        console.log(foundAdvers);
        res.render('myDivar', {
            title: 'دیوار من',
            page: 'myBookmark',
            auth: req.user,
            myProvince: myProvince,
            select: req.session.province,
            advers: foundAdvers
        });
    }).catch(err => {
        // error here
    });


});
router.get('/my-divar/recent-seen', function (req, res, next) {
    res.render('myDivar', {
        title: 'دیوار من',
        page: 'recentSeen',
        auth: req.user,
        myProvince: myProvince,
        select: req.session.province
    });
});


module.exports = router;

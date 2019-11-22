var express = require('express');
var router = express.Router();


/* GET Barang page */

router.get('/', function(req, res, next) {
    req.getConnection(function(err,connection){
        var query = ('SELECT * FROM barang');
        connection.query(query, function(err,rows)
        {
            if(err)
                var errornya = ("Error Selecting : %s ",err);
            req.flash('msg_error', errornya);
            res.render('barang/list',{title:"Barang",data:rows});
        });
    });
    // console.log(query.sql) ;
});

router.delete('/delete/(:id)', function(req, res, next) {
    req.getConnection(function(err,connection){
        var barang = {
            id: req.params.id,
        }

        var delete_sql = 'delete from barang where ?';
        req.getConnection(function(err,connection){
            var query = connection.query(delete_sql, barang, function(err, result){
                if(err)
                {
                    var error_detail = ("Error Delete : %s ",err);
                    req.flash('msg_error', error_detail);
                    res.redirect('/barangs');
                }
                else{
                    req.flash('msg_info', 'Delete Barang Success');
                    res.redirect('/barangs');
                }
            });
        });
    });
});
router.get('/edit/(:id)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/barang'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Barang can't be find!"); 
					res.redirect('/barang');
				}
				else
				{	
					console.log(rows);
					res.render('barang/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id)', function(req,res,next){
	req.assert('kode', 'Please fill the kode').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_merek = req.sanitize( 'merek' ).escape().trim();
		v_satuan = req.sanitize( 'satuan' ).escape().trim();
		v_jumlah = req.sanitize( 'jumlah' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();

		var barang = {
            kode: v_kode,
            nama: v_nama,
            merek: v_merek,
            satuan: v_satuan,
            jumlah: v_jumlah,
            harga: v_harga
		}

		var update_sql = 'update barang SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/edit', 
					{ 
                        kode: req.param('kode'),
                        nama: req.param('nama'),
                        merek: req.param('merek'),
                        satuan: req.param('satuan'),
                        jumlah: req.param('jumlah'),
                        harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Update barang success'); 
					res.redirect('/barangs/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-barang', 
		{ 
			kode: req.param('kode'), 
			nama: req.param('nama')
		});
	}
});
router.post('/add', function(req, res, next) {
	req.assert('kode', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

        v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_merek = req.sanitize( 'merek' ).escape().trim();
		v_satuan = req.sanitize( 'satuan' ).escape().trim();
		v_jumlah = req.sanitize( 'jumlah' ).escape().trim();
		v_harga = req.sanitize( 'harga' ).escape().trim();

		var barang = {
			kode: v_kode,
            nama: v_nama,
            merek: v_merek,
            satuan: v_satuan,
            jumlah: v_jumlah,
            harga: v_harga
		}

		var insert_sql = 'INSERT INTO barang SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/add-barang', 
					{ 
						kode: req.param('kode'),
                        nama: req.param('nama'),
                        merek: req.param('merek'),
                        satuan: req.param('satuan'),
                        jumlah: req.param('jumlah'),
                        harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Create barang success'); 
					res.redirect('/barangs');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-barang', 
		{ 
            kode: req.param('kode'), 
			nama: req.param('nama')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'barang/add-barang', 
	{ 
		title: 'Add New barang',
        kode: '',
        nama: '',
        merek: '',
        satuan: '',
        jumlah: '',
        harga: ''
	});
});

module.exports = router;
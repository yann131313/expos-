var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

function log(message) {
    console.log(new Date(), message);
}

log('starting express');
var app = express();
log('express started');

log('configurer le moteur de vue pour utiliser ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

/* On utilise les sessions */
app.use(session({secret: 'todotopsecret'}));
log('setup session secret');

/* S'il n'y a pas de todolist dans la session,
on en crée une vide sous forme d'array avant la suite */
app.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        log('ajouter la todolist dans la session');
        req.session.todolist = [];
    }
    next();
})

/* On affiche la todolist et le formulaire */
.get('/todo', function(req, res) { 
    log('afficher views/index.html avec la todolist');
    res.render('index', { todolist: req.session.todolist });
})

/* On ajoute un élément à la todolist */
.post('/todo/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        log(`ajouter ${req.body.newtodo} a la todolist`);
        req.session.todolist.push(req.body.newtodo);
    }
    log('redirect /todo');
    res.redirect('/todo');
})

/* Supprime un élément de la todolist */
.get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        log(`supprimer ${req.body.newtodo} de la todolist`);
        req.session.todolist.splice(req.params.id, 1);
    }
    log('redirect /todo');
    res.redirect('/todo');
})

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
.use(function(req, res, next){
    log('redirect /todo');
    res.redirect('/todo');
})

.listen(8080);

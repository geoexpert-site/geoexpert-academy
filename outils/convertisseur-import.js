/* Lecture de fichiers de points (CSV, TXT, GPX, KML, GeoJSON) pour l'outil « Plusieurs points ».
   Les fichiers sont lus par le navigateur (FileReader) : rien n'est envoyé nulle part. */
(function (root) {
  'use strict';
  var G = root.GeoConv;
  var MAX_OCTETS = 5 * 1024 * 1024;

  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  }
  var NOMS_LAT = ['lat', 'latitude', 'latitud'];
  var NOMS_LON = ['lon', 'lng', 'long', 'longitude', 'longitud'];
  var NOMS_EST = ['est', 'easting', 'estm', 'xutm', 'eastingm'];
  var NOMS_NORD = ['nord', 'northing', 'nordm', 'yutm', 'northingm'];
  var NOMS_ZONE = ['zone', 'fuseau', 'utmzone', 'zoneutm'];
  var NOMS_GROUPE = ['parcelle', 'parcel', 'lot', 'polygone', 'polygon', 'groupe', 'group', 'idparcelle', 'nomparcelle', 'parcelleid', 'numparcelle'];
  var NOMS_LIBELLE = ['nom', 'name', 'libelle', 'label', 'parcelle', 'lot', 'id'];

  function indexDe(noms, liste) {
    for (var i = 0; i < noms.length; i++) if (liste.indexOf(noms[i]) >= 0) return i;
    return -1;
  }

  // Découpe une ligne CSV en respectant les guillemets
  function champs(ligne, sep) {
    var out = [], cur = '', q = false;
    for (var i = 0; i < ligne.length; i++) {
      var c = ligne.charAt(i);
      if (c === '"') { if (q && ligne.charAt(i + 1) === '"') { cur += '"'; i++; } else q = !q; }
      else if (c === sep && !q) { out.push(cur.trim()); cur = ''; }
      else cur += c;
    }
    out.push(cur.trim());
    return out;
  }

  function lireCsv(texte) {
    var lignes = texte.replace(/^﻿/, '').split(/\r?\n/).filter(function (l) { return l.trim() !== ''; });
    if (!lignes.length) return { erreur: 'Le fichier est vide.' };
    var premiere = lignes[0];
    var sep = premiere.indexOf('\t') >= 0 ? '\t' : (premiere.indexOf(';') >= 0 ? ';' : ',');
    var rows = lignes.map(function (l) { return champs(l, sep); });

    var estNombre = function (v) { return !isNaN(G.lireNombre(v)); };
    var entete = rows[0].every(function (v) { return v === '' || !estNombre(v); });
    var noms = entete ? rows[0].map(norm) : [];
    var data = entete ? rows.slice(1) : rows;
    if (!data.length) return { erreur: 'Aucune ligne de données après l’en-tête.' };

    var iLat = indexDe(noms, NOMS_LAT), iLon = indexDe(noms, NOMS_LON);
    var iEst = indexDe(noms, NOMS_EST), iNord = indexDe(noms, NOMS_NORD), iZone = indexDe(noms, NOMS_ZONE);
    var iGrp = indexDe(noms, NOMS_GROUPE), iLib = indexDe(noms, NOMS_LIBELLE);

    // Noms de colonnes plus libres : « latitude_deg », « Longitude (°) », « X coord »…
    if (entete) {
      var brut = rows[0].map(function (h) { return ' ' + h.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ') + ' '; });
      var trouver = function (mots) {
        for (var i = 0; i < brut.length; i++) for (var j = 0; j < mots.length; j++) if (brut[i].indexOf(' ' + mots[j] + ' ') >= 0) return i;
        return -1;
      };
      if (iLat < 0) iLat = trouver(['lat', 'latitude', 'latitud']);
      if (iLon < 0) iLon = trouver(['lon', 'long', 'lng', 'longitude', 'longitud']);
      if (iEst < 0) iEst = trouver(['est', 'easting']);      // « X_Est_m », « Est (m) »…
      if (iNord < 0) iNord = trouver(['nord', 'northing']);  // « Y_Nord_m », « Nord (m) »…
      if (iZone < 0) iZone = trouver(['zone', 'fuseau']);
    }

    // Colonne de géométrie WKT (exports QGIS, OpenStreetMap…) : POINT (lon lat), ou le centre approché d'un polygone
    var iWkt = -1;
    if (iLat < 0 || iLon < 0) {
      var reWkt = /^\s*(MULTI)?(POINT|LINESTRING|POLYGON)/i;
      for (var c = 0; c < (data[0] || []).length; c++) {
        if (reWkt.test(data[0][c]) || (entete && /^(wkt|geom|geometry|thegeom|wktgeom|geometrie)$/.test(noms[c]))) { iWkt = c; break; }
      }
    }
    if (iWkt >= 0 && !(iLat >= 0 && iLon >= 0)) {
      var ptsWkt = [], ignWkt = 0, approx = false;
      data.forEach(function (r) {
        var txt = String(r[iWkt] || ''), re = /(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)\s+(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)/g, m, n = 0, sx = 0, sy = 0;
        var sommets = [];
        while ((m = re.exec(txt))) sommets.push([parseFloat(m[1]), parseFloat(m[2])]);
        // un anneau de polygone se termine par son premier sommet : on ne le compte qu'une fois
        if (sommets.length > 2 && sommets[0][0] === sommets[sommets.length - 1][0] && sommets[0][1] === sommets[sommets.length - 1][1]) sommets.pop();
        sommets.forEach(function (s) { sx += s[0]; sy += s[1]; n++; });
        if (!n) { ignWkt++; return; }
        if (n > 1) approx = true;
        ptsWkt.push({ lat: Math.round(sy / n * 1e7) / 1e7, lon: Math.round(sx / n * 1e7) / 1e7 });
      });
      return { mode: 'gps', points: ptsWkt, ignorees: ignWkt, approx: approx,
        wkts: data.map(function (r) { return String(r[iWkt] || ''); }),
        libelles: data.map(function (r) { return iLib >= 0 ? String(r[iLib] || '') : ''; }) };
    }

    var mode = null, a, b, z = -1;
    if (iLat >= 0 && iLon >= 0) { mode = 'gps'; a = iLat; b = iLon; }
    else if (iEst >= 0 && iNord >= 0) { mode = 'utm'; a = iEst; b = iNord; z = iZone; }
    else if (entete) {
      var iX = noms.indexOf('x'), iY = noms.indexOf('y');
      if (iX < 0 || iY < 0) return { erreur: 'Colonnes non reconnues (colonnes trouvées : ' + rows[0].slice(0, 12).join(', ') + (rows[0].length > 12 ? '…' : '') + '). Nommez-les latitude et longitude, ou Est et Nord (plus zone), ou x et y, ou gardez une colonne de géométrie WKT.' };
      var x0 = G.lireNombre((data[0] || [])[iX]);
      if (Math.abs(x0) > 1000) { mode = 'utm'; a = iX; b = iY; z = iZone; }
      else { mode = 'gps'; a = iY; b = iX; } // x = longitude, y = latitude
    } else {
      var v0 = G.lireNombre(rows[0][0]);
      if (Math.abs(v0) > 1000) { mode = 'utm'; a = 0; b = 1; z = rows[0].length > 2 ? 2 : -1; }
      else { mode = 'gps'; a = 0; b = 1; } // latitude, longitude
    }

    var points = [], ignorees = 0;
    data.forEach(function (r) {
      var p = G.lireNombre(r[a]), q = G.lireNombre(r[b]);
      if (isNaN(p) || isNaN(q)) { ignorees++; return; }
      var g = iGrp >= 0 ? String(r[iGrp] || '').trim() : '';
      if (mode === 'gps') points.push({ lat: p, lon: q, g: g });
      else points.push({ est: p, nord: q, zone: z >= 0 ? String(r[z] || '').trim() : '', g: g });
    });
    return { mode: mode, points: points, ignorees: ignorees, groupes: iGrp >= 0 };
  }

  function analyserXml(texte) {
    var doc = new DOMParser().parseFromString(texte, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) return null;
    return doc;
  }

  function lireGpx(texte) {
    var doc = analyserXml(texte);
    if (!doc) return { erreur: 'Fichier GPX illisible.' };
    var points = [];
    ['wpt', 'trkpt', 'rtept'].forEach(function (tag) {
      var els = doc.getElementsByTagName(tag);
      for (var i = 0; i < els.length; i++) {
        var lat = G.lireNombre(els[i].getAttribute('lat')), lon = G.lireNombre(els[i].getAttribute('lon'));
        if (!isNaN(lat) && !isNaN(lon)) points.push({ lat: lat, lon: lon });
      }
    });
    return { mode: 'gps', points: points, ignorees: 0 };
  }

  function lireKml(texte) {
    var doc = analyserXml(texte);
    if (!doc) return { erreur: 'Fichier KML illisible.' };
    var points = [], els = doc.getElementsByTagName('coordinates');
    for (var i = 0; i < els.length; i++) {
      var parent = els[i].parentNode;
      if (!parent || parent.localName !== 'Point') continue; // seulement les points (pas les lignes ni les polygones)
      var c = els[i].textContent.trim().split(',');
      var lon = G.lireNombre(c[0]), lat = G.lireNombre(c[1]);
      if (!isNaN(lat) && !isNaN(lon)) points.push({ lat: lat, lon: lon });
    }
    return { mode: 'gps', points: points, ignorees: 0 };
  }

  function lireGeoJson(texte) {
    var obj;
    try { obj = JSON.parse(texte); } catch (e) { return { erreur: 'Fichier GeoJSON illisible.' }; }
    var points = [];
    (function marcher(o) {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(marcher); return; }
      if (o.type === 'FeatureCollection') marcher(o.features);
      else if (o.type === 'Feature') marcher(o.geometry);
      else if (o.type === 'GeometryCollection') marcher(o.geometries);
      else if (o.type === 'Point' && Array.isArray(o.coordinates)) ajouter(o.coordinates);
      else if (o.type === 'MultiPoint' && Array.isArray(o.coordinates)) o.coordinates.forEach(ajouter);
    })(obj);
    function ajouter(c) { if (typeof c[0] === 'number' && typeof c[1] === 'number') points.push({ lat: c[1], lon: c[0] }); }
    return { mode: 'gps', points: points, ignorees: 0 };
  }

  // Lit un fichier déjà chargé en texte. Renvoie { mode, points, ignorees } ou { erreur }.
  function lireFichier(nom, texte) {
    var ext = (/\.([a-z0-9]+)$/i.exec(nom) || [, ''])[1].toLowerCase();
    var debut = texte.replace(/^﻿/, '').trimStart().charAt(0);
    if (ext === 'gpx') return lireGpx(texte);
    if (ext === 'kml') return lireKml(texte);
    if (ext === 'geojson' || (ext === 'json')) return lireGeoJson(texte);
    if (ext === 'csv' || ext === 'txt' || ext === 'tsv') return lireCsv(texte);
    if (debut === '{') return lireGeoJson(texte);
    if (debut === '<') return /<gpx/i.test(texte) ? lireGpx(texte) : lireKml(texte);
    return lireCsv(texte);
  }

  // Comme lireFichier, mais pour GeoJSON et KML on garde TOUS les sommets des lignes et des polygones (contour extérieur,
  // sans répéter le premier point à la fin), dans l'ordre du fichier. Sert aux outils qui travaillent sur des tracés
  // (coordonnées vers KML, distance, visualiseur) : un fichier exporté par ces outils peut ainsi être ré-importé.
  function enleverFermeture(pts) {
    if (pts.length > 3 && pts[0].lat === pts[pts.length - 1].lat && pts[0].lon === pts[pts.length - 1].lon) return pts.slice(0, -1);
    return pts;
  }
  function sommetsGeoJson(texte) {
    var obj, points = [];
    try { obj = JSON.parse(texte); } catch (e) { return { erreur: 'Fichier GeoJSON illisible.' }; }
    function pt(c) { return (c && typeof c[0] === 'number' && typeof c[1] === 'number') ? { lat: c[1], lon: c[0] } : null; }
    function suite(liste) { return (liste || []).map(pt).filter(Boolean); }
    (function marcher(o) {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(marcher); return; }
      var c = o.coordinates;
      switch (o.type) {
        case 'FeatureCollection': marcher(o.features); break;
        case 'Feature': marcher(o.geometry); break;
        case 'GeometryCollection': marcher(o.geometries); break;
        case 'Point': if (pt(c)) points.push(pt(c)); break;
        case 'MultiPoint': case 'LineString': if (Array.isArray(c)) points.push.apply(points, suite(c)); break;
        case 'MultiLineString': if (Array.isArray(c)) c.forEach(function (l) { points.push.apply(points, suite(l)); }); break;
        case 'Polygon': if (Array.isArray(c) && c[0]) points.push.apply(points, enleverFermeture(suite(c[0]))); break;
        case 'MultiPolygon': if (Array.isArray(c)) c.forEach(function (p) { if (p && p[0]) points.push.apply(points, enleverFermeture(suite(p[0]))); }); break;
      }
    })(obj);
    return { mode: 'gps', points: points, ignorees: 0 };
  }
  function sommetsKml(texte) {
    var doc = analyserXml(texte);
    if (!doc) return { erreur: 'Fichier KML illisible.' };
    var points = [], els = doc.getElementsByTagName('coordinates');
    for (var i = 0; i < els.length; i++) {
      var parent = els[i].parentNode, nom = parent ? parent.localName : '';
      if (nom !== 'Point' && nom !== 'LineString' && nom !== 'LinearRing') continue;
      var interieur = false;
      for (var a = parent.parentNode; a; a = a.parentNode) if (a.localName === 'innerBoundaryIs') interieur = true;
      if (interieur) continue; // trous des polygones : ignorés
      var pts = coordsKml(els[i]);
      points.push.apply(points, nom === 'LinearRing' ? enleverFermeture(pts) : pts);
    }
    return { mode: 'gps', points: points, ignorees: 0 };
  }
  function lireSommets(nom, texte) {
    var ext = (/\.([a-z0-9]+)$/i.exec(nom) || [, ''])[1].toLowerCase();
    var debut = texte.replace(/^﻿/, '').trimStart().charAt(0);
    if (ext === 'geojson' || ext === 'json' || (!ext && debut === '{')) return sommetsGeoJson(texte);
    if (ext === 'kml' || (!ext && debut === '<' && !/<gpx/i.test(texte))) return sommetsKml(texte);
    return lireFichier(nom, texte);
  }

  // Met les points au format de la zone de texte « Plusieurs points ».
  function versTexte(mode, points) {
    return points.map(function (p) {
      return mode === 'gps' ? p.lat + ', ' + p.lon : p.est + '; ' + p.nord + (p.zone ? '; ' + p.zone : '');
    }).join('\n');
  }


  // ====================== PARCELLES (calculateur de surface) ======================
  // Un fichier peut contenir une ou plusieurs parcelles. Résultat : { parcelles: [{ libelle, mode, points, trous }], ignorees } ou { erreur }.
  // - polygones GeoJSON / KML / WKT : une parcelle par polygone (contour extérieur ; les trous sont signalés mais ignorés) ;
  // - tracés et routes GPX : une parcelle par tracé ;
  // - CSV de points : une parcelle par valeur de la colonne « parcelle » / « lot » / « polygone »…, sinon une seule parcelle.
  function nettoyerAnneau(pts) {
    return pts.length > 2 && pts[0].lat === pts[pts.length - 1].lat && pts[0].lon === pts[pts.length - 1].lon ? pts.slice(0, -1) : pts;
  }
  function parcelleGps(libelle, pts, trous) { return { libelle: libelle, mode: 'gps', points: nettoyerAnneau(pts), trous: trous || 0 }; }

  // WKT : POLYGON((a b, c d, ...),(trou)) ou MULTIPOLYGON(((...)),((...))). Renvoie [{ exterieur: [{lat,lon}], trous: n }].
  function wktPolygones(txt) {
    var m = /^\s*(MULTIPOLYGON|POLYGON)\s*(?:ZM|Z|M)?\s*(\(.*\))\s*$/i.exec(String(txt || ''));
    if (!m) return null;
    var multi = /^MULTI/i.test(m[1]), i = 0, corps = m[2];
    function lireListe() {
      var enfants = [], nombres = '';
      i++; // saute la parenthèse ouvrante
      while (i < corps.length) {
        var c = corps.charAt(i);
        if (c === '(') enfants.push(lireListe());
        else if (c === ')') { i++; return { enfants: enfants, texte: nombres }; }
        else { nombres += c; i++; }
      }
      return { enfants: enfants, texte: nombres };
    }
    var racine = lireListe();
    function anneau(noeud) {
      var pts = [];
      noeud.texte.split(',').forEach(function (morceau) {
        var r = /(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)\s+(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)/.exec(morceau);
        if (r) pts.push({ lat: parseFloat(r[2]), lon: parseFloat(r[1]) });
      });
      return pts;
    }
    var polys = multi ? racine.enfants : [racine];
    return polys.map(function (p) { return { exterieur: anneau(p.enfants[0] || { texte: '' }), trous: Math.max(0, p.enfants.length - 1) }; });
  }

  function parcellesCsv(r) {
    if (r.wkts) { // colonne de géométrie WKT contenant des polygones
      var res = [], n = 0, polygones = false;
      r.wkts.forEach(function (w, idx) {
        var ps = wktPolygones(w);
        if (!ps) return;
        polygones = true;
        ps.forEach(function (p, k) {
          if (p.exterieur.length < 3) return;
          n++;
          res.push(parcelleGps((r.libelles[idx] || ('Polygone ' + n)) + (ps.length > 1 ? ' (' + (k + 1) + ')' : ''), p.exterieur, p.trous));
        });
      });
      if (polygones) return { parcelles: res, ignorees: 0 };
    }
    if (!r.points || !r.points.length) return { parcelles: [], ignorees: r.ignorees || 0 };
    if (r.groupes) { // une parcelle par valeur de la colonne de groupe, dans l'ordre d'apparition
      var ordre = [], parG = {};
      r.points.forEach(function (p) {
        var cle = p.g || '(sans nom)';
        if (!parG[cle]) { parG[cle] = []; ordre.push(cle); }
        parG[cle].push(p);
      });
      return { parcelles: ordre.map(function (cle) { return { libelle: cle, mode: r.mode, points: parG[cle], trous: 0 }; }), ignorees: r.ignorees || 0 };
    }
    return { parcelles: [{ libelle: 'Points du fichier', mode: r.mode, points: r.points, trous: 0 }], ignorees: r.ignorees || 0 };
  }

  function parcellesGeoJson(texte) {
    var obj;
    try { obj = JSON.parse(texte); } catch (e) { return { erreur: 'Fichier GeoJSON illisible.' }; }
    var res = [], pts = [], n = 0;
    function nom(props, k) {
      props = props || {};
      var v = props.name || props.nom || props.Name || props.NOM || props.parcelle || props.lot || props.id;
      return v != null && String(v) !== '' ? String(v) : 'Polygone ' + k;
    }
    function anneau(coords) {
      return coords.filter(function (c) { return typeof c[0] === 'number' && typeof c[1] === 'number'; }).map(function (c) { return { lat: c[1], lon: c[0] }; });
    }
    (function marcher(o, props) {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(function (x) { marcher(x, props); }); return; }
      if (o.type === 'FeatureCollection') marcher(o.features, props);
      else if (o.type === 'Feature') marcher(o.geometry, o.properties);
      else if (o.type === 'GeometryCollection') marcher(o.geometries, props);
      else if (o.type === 'Polygon' && Array.isArray(o.coordinates)) { n++; res.push(parcelleGps(nom(props, n), anneau(o.coordinates[0] || []), o.coordinates.length - 1)); }
      else if (o.type === 'MultiPolygon' && Array.isArray(o.coordinates)) {
        o.coordinates.forEach(function (pc, k) { n++; res.push(parcelleGps(nom(props, n) + ' (' + (k + 1) + ')', anneau(pc[0] || []), pc.length - 1)); });
      }
      else if (o.type === 'Point' && Array.isArray(o.coordinates)) pts.push.apply(pts, anneau([o.coordinates]));
      else if (o.type === 'MultiPoint' && Array.isArray(o.coordinates)) pts.push.apply(pts, anneau(o.coordinates));
    })(obj, null);
    if (!res.length && pts.length) res.push({ libelle: 'Points du fichier', mode: 'gps', points: pts, trous: 0 });
    return { parcelles: res.filter(function (p) { return p.points.length; }), ignorees: 0 };
  }

  function coordsKml(el) { // « lon,lat,alt lon,lat,alt … »
    return el.textContent.trim().split(/\s+/).map(function (t) {
      var c = t.split(','), lon = G.lireNombre(c[0]), lat = G.lireNombre(c[1]);
      return isNaN(lat) || isNaN(lon) ? null : { lat: lat, lon: lon };
    }).filter(Boolean);
  }
  function enfantTexte(el, tag) {
    for (var c = el.firstElementChild; c; c = c.nextElementSibling) if (c.localName === tag) return c.textContent.trim();
    return '';
  }
  function parcellesKml(texte) {
    var doc = analyserXml(texte);
    if (!doc) return { erreur: 'Fichier KML illisible.' };
    var res = [], pts = [], n = 0, marques = doc.getElementsByTagName('Placemark');
    for (var i = 0; i < marques.length; i++) {
      var nomPm = enfantTexte(marques[i], 'name'), polys = marques[i].getElementsByTagName('Polygon');
      for (var k = 0; k < polys.length; k++) {
        var ext = polys[k].getElementsByTagName('outerBoundaryIs')[0], cs = ext ? ext.getElementsByTagName('coordinates')[0] : null;
        if (!cs) continue;
        n++;
        res.push(parcelleGps((nomPm || 'Polygone ' + n) + (polys.length > 1 ? ' (' + (k + 1) + ')' : ''), coordsKml(cs), polys[k].getElementsByTagName('innerBoundaryIs').length));
      }
      var points = marques[i].getElementsByTagName('Point');
      for (var q = 0; q < points.length; q++) { var pc = points[q].getElementsByTagName('coordinates')[0]; if (pc) pts.push.apply(pts, coordsKml(pc)); }
    }
    if (!res.length && pts.length) res.push({ libelle: 'Points du fichier', mode: 'gps', points: pts, trous: 0 });
    return { parcelles: res.filter(function (p) { return p.points.length; }), ignorees: 0 };
  }

  function parcellesGpx(texte) {
    var doc = analyserXml(texte);
    if (!doc) return { erreur: 'Fichier GPX illisible.' };
    var res = [];
    function pointsDe(el, tag) {
      var out = [], els = el.getElementsByTagName(tag);
      for (var i = 0; i < els.length; i++) {
        var lat = G.lireNombre(els[i].getAttribute('lat')), lon = G.lireNombre(els[i].getAttribute('lon'));
        if (!isNaN(lat) && !isNaN(lon)) out.push({ lat: lat, lon: lon });
      }
      return out;
    }
    [['trk', 'trkpt', 'Tracé'], ['rte', 'rtept', 'Route']].forEach(function (d) {
      var els = doc.getElementsByTagName(d[0]);
      for (var i = 0; i < els.length; i++) res.push(parcelleGps(enfantTexte(els[i], 'name') || (d[2] + ' ' + (i + 1)), pointsDe(els[i], d[1])));
    });
    if (!res.length) { var w = pointsDe(doc, 'wpt'); if (w.length) res.push({ libelle: 'Points du fichier', mode: 'gps', points: w, trous: 0 }); }
    return { parcelles: res.filter(function (p) { return p.points.length; }), ignorees: 0 };
  }

  function lireParcelles(nom, texte) {
    var ext = (/\.([a-z0-9]+)$/i.exec(nom) || [, ''])[1].toLowerCase();
    var debut = texte.replace(/^﻿/, '').trimStart().charAt(0);
    var kind = ext === 'gpx' ? 'gpx' : ext === 'kml' ? 'kml' : (ext === 'geojson' || ext === 'json') ? 'geojson'
      : (ext === 'csv' || ext === 'txt' || ext === 'tsv') ? 'csv' : debut === '{' ? 'geojson' : debut === '<' ? (/<gpx/i.test(texte) ? 'gpx' : 'kml') : 'csv';
    if (kind === 'gpx') return parcellesGpx(texte);
    if (kind === 'kml') return parcellesKml(texte);
    if (kind === 'geojson') return parcellesGeoJson(texte);
    var r = lireCsv(texte);
    return r.erreur ? r : parcellesCsv(r);
  }

  root.GeoImport = { lireFichier: lireFichier, lireSommets: lireSommets, lireParcelles: lireParcelles, versTexte: versTexte, MAX_OCTETS: MAX_OCTETS };
})(window);

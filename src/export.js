import distance from 'euclidean';
import {saveAs} from 'file-saver';
import Jimp from 'jimp';
import JsZip from 'jszip';
import proj4 from 'proj4';

import {state} from './main.js';
import {
  destination,
  direction,
  markerToXy,
  radToDeg
} from './util.js';

export default async function exportPages() {
  const zip = new JsZip();
  for (let page of state.pages) {
    const {points} = page;
    const pageA = markerToXy(points[0].marker);
    const pageB = markerToXy(points[1].marker);
    const localA = [points[0].point.localX, points[0].point.localY];
    const localB = [points[1].point.localX, points[1].point.localY];
    const pageDistance = distance(pageA, pageB);
    const pageDirection = direction(pageA, pageB);
    const localDistance = distance(localA, localB);
    const localDirection = direction(localA, localB);
    const pageRotation = pageDirection - localDirection;
    const unitsPerPixel = localDistance / pageDistance;
    const pageSize = await page.size;
    const corners = {};
    for (let corner of ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']) {
      const pageCorner = [
        corner.endsWith('Left') ? 0 : pageSize.width,
        corner.startsWith('bottom') ? 0 : pageSize.height
      ];
      const pageDistToCorner = distance(pageA, pageCorner);
      const pageDirToCorner = direction(pageA, pageCorner);
      const localDistToCorner = pageDistToCorner * unitsPerPixel;
      let localDirToCorner = pageDirToCorner - pageRotation;
      if (localDirToCorner < 0) localDirToCorner += (Math.PI * 2);
      const localCorner = destination(localA, localDirToCorner, localDistToCorner, false, false);
      corners[corner] = {
        local: localCorner,
        page: pageCorner,
        wgs84: proj4(state.localCrs.proj4).inverse(localCorner)
      };
    }
    const jimp = await Jimp.read(page.objectUrl);
    jimp.rotate(radToDeg(-pageRotation));
    zip.file(
      `${state.form.name} - page ${page.id + 1}.png`,
      await jimp.getBufferAsync('image/png')
    );
    let minX = Infinity;
    let maxY = -Infinity;
    for (let corner in corners) {
      const [x, y] = corners[corner].local;
      if (x < minX) minX = x;
      if (y > maxY) maxY = y;
    }
    const world = [
      String(unitsPerPixel),
      '0.0',
      '0.0',
      String(-unitsPerPixel),
      String(minX + unitsPerPixel),
      String(maxY - unitsPerPixel)
    ].join('\n');
    zip.file(`${state.form.name} - page ${page.id + 1}.pgw`, world);
    const aux = `\
      <PAMDataset>
        <SRS>${state.localCrs.proj4}</SRS>
        <Metadata domain="IMAGE_STRUCTURE">
          <MDI key="INTERLEAVE">PIXEL</MDI>
        </Metadata>
      </PAMDataset>\
    `.replace(/  /g, '').replace(/\n/g, '');
    zip.file(`${state.form.name} - page ${page.id + 1}.png.aux.xml`, aux);
  }
  saveAs(
    await zip.generateAsync({type: 'blob'}),
    `${state.form.name}.zip`
  );
};
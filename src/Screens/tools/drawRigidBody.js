/**
 * Draw a rigid body on the canvas
 *
 * @typedef {Number[2]} point - A point vector from the center of the rigid body
 * @typedef {{stroke: {color: String, width: Number}, fill: {color: String, [image]: image}}} style - The style of the rigid body
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {String} type - The type of the rigid body('Circle' or 'Convex')
 * @param {Number} center_x - The x coordinate of the center of the rigid body
 * @param {Number} center_y - The y coordinate of the center of the rigid body
 * @param {Number} angle - The angle of the rigid body(Just for test purpose)
 * @param {style} texture - The style of the rigid body
 * @param {Number} [radius] - The radius of the circle if the type is 'Circle'
 * @param {point[]} [points] - The points of the convex if the type is 'Convex'
 */
const drawRigidBody = function (ctx, type, center_x, center_y, angle, texture, radius, points){
    if(type==='Circle'){
        if(radius === undefined) return;
        ctx.save()
        ctx.beginPath();
        if(texture.fill){
            if(texture.fill.image){
                let img = new Image();
                img.src = texture.fill.image;
                ctx.drawImage(img, center_x-radius, center_y-radius, 2*radius, 2*radius);
            }else{
                ctx.fillStyle = texture.fill.color;
                ctx.arc(center_x, center_y, radius, 0, 2*Math.PI);
                ctx.fill();
            }
        }
        if(texture.stroke){
            ctx.strokeStyle = texture.stroke.color;
            ctx.lineWidth = texture.stroke.width;
            ctx.arc(center_x, center_y, radius, 0, 2*Math.PI);
            ctx.stroke();
        }
    }else if(type === 'Convex'){
        if(points === undefined) return;
        ctx.save()
        ctx.beginPath();
        ctx.moveTo(center_x+points[0][0], center_y+points[0][1]);
        for(let i=1; i<points.length; i++){
            ctx.lineTo(center_x+points[i][0], center_y+points[i][1]);
        }
        ctx.closePath();
        if(texture.fill){
            if(texture.fill.image){
                let img = new Image();
                img.src = texture.fill.image;
                ctx.drawImage(img, center_x+points[0][0], center_y+points[0][1], points[1][0]-points[0][0], points[2][1]-points[0][1]);
            }else{
                ctx.fillStyle = texture.fill.color;
                ctx.fill();
            }
        }
        if(texture.stroke){
            ctx.strokeStyle = texture.stroke.color;
            ctx.lineWidth = texture.stroke.width;
            ctx.stroke();
    }
}};

export {drawRigidBody};
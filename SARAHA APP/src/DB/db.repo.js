export const findone=async({model,filter={},select="",options={}}={})=>{
    const doc= model.findOne(filter)

    if (select.length) doc.select (select)
    if (options.populate) doc.populate(options.populate)
    if (options.lean) doc.lean()

    return await doc.exec()
}

export const create=async({model,data,options={validateBeforeSave:true}}={})=>{
    const doc = new model(data);
    return await doc.save(options);
};





export const findbyid=async({model,id,select="",options={}}={})=>{
    const doc= model.findById(id)

    if (select.length) doc.select (select)
    if (options.populate) doc.populate(options.populate)
    if (options.lean) doc.lean()

    return await doc.exec()
}

export const find=async({model,filter={},select="",options={}}={})=>{
    const doc= model.find(filter)

    if (select.length) doc.select (select)
    if (options.populate) doc.populate(options.populate)
    if (options.lean) doc.lean();
    if(options?.limit) doc.limit(options.limit);
    if(options?.skip) doc.skip(options.skip);

    return await doc.exec()
};

export const insertmany=async({model,data}={})=>{
    return await model.insertMany(data)
}   

export const updateone=async({model,filter,update,options={}}={})=>{
   return await model.updateOne(filter,{...update,$inc:{__v:1}},options)
};

export const findoneandupdate=async({model,filter,update,options={}}={})=>{
    return await model.findOneAndUpdate(filter,{...update,$inc:{__v:1}},{...options, returnDocument: 'after', runValidators:true} );
};

export const deleteone=async({model,filter}={})=>{
    return await model.deleteOne(filter)
};

export const findoneanddelete=async({model,filter}={})=>{
    return await model.findOneAndDelete(filter)
};

export const deletemany=async({model,filter}={})=>{
    return await model.deleteMany(filter)
}   

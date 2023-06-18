import {GraphQLJSONObject} from 'graphql-type-json'
import shortid from 'shortid'

export default {
    JSON: GraphQLJSONObject,

    Query: {
        allLayers: (root, args, {db}) => db.chain.get('layers').value()
    },

    Mutation: {
        addLayer: (root, {input}, {pubsub, db}) => {
            const layer = {
                id: shortid.generate(),
                title: input.title,
                visible: false,
                content: input.content
            }
            db.chain.get('layers').value().push(layer);
            pubsub.publish('LAYER_ADDED', {layerAdded: layer});
            db.write();
            return layer;
        },

        deleteLayer: (root, {id}, {pubsub, db}) => {
            const layer = db.chain.get('layers').find({id: id}).value();
            db.chain.get('layers').remove({id: id});
            pubsub.publish('LAYER_DELETED', {layerDeleted: layer});
            db.write();
            return layer;
        },

        updateLayer: (root, {input}, {db}) => {
            const layer = db.chain.get('layers').find({id: input.id}).assign(
                {
                    title: input.title,
                    visible: input.visible,
                    content: input.content
                }).value();
            db.write();
            return layer;
        },
    },

    Subscription: {
        layerAdded: {
            subscribe: (parent, args, {pubsub}) => pubsub.asyncIterator('LAYER_ADDED'),
        },
        layerDeleted: {
            subscribe: (parent, args, {pubsub}) => pubsub.asyncIterator('LAYER_DELETED')
        }
    },
}

const prisma = require('../prisma/db');

const getObjects = async (actorId, actorType, objectType, permission) => {
  const actorTypeId = await prisma.node_actor_type.findUnique({
    where: { label: actorType },
    select: {
      id: true,
    },
  });

  const permissionId = await prisma.node_permission.findUnique({
    where: { label: permission },
    select: {
      id: true,
    },
  });

  const permittedObjectIds = await prisma.node_acl.findMany({
    where: {
      actor_id: actorId,
      object_type: objectType,
      actor_type_id: actorTypeId.id,
      permission_id: permissionId.id,
    },
    select: {
      object_id: true,
    },
  });
  return permittedObjectIds.map((p) => p.object_id);
};

module.exports = { getObjects };

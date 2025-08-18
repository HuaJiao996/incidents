import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object(
  {
    id: t.String(),
    name: t.String(),
    email: t.String(),
    emailVerified: t.Boolean(),
    image: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    role: __nullable__(t.String()),
    banned: __nullable__(t.Boolean()),
    banReason: __nullable__(t.String()),
    banExpires: __nullable__(t.Date()),
  },
  { additionalProperties: false },
);

export const UserRelations = t.Object(
  {
    sessions: t.Array(
      t.Object(
        {
          id: t.String(),
          expiresAt: t.Date(),
          token: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          ipAddress: __nullable__(t.String()),
          userAgent: __nullable__(t.String()),
          userId: t.String(),
          impersonatedBy: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    accounts: t.Array(
      t.Object(
        {
          id: t.String(),
          accountId: t.String(),
          providerId: t.String(),
          userId: t.String(),
          accessToken: __nullable__(t.String()),
          refreshToken: __nullable__(t.String()),
          idToken: __nullable__(t.String()),
          accessTokenExpiresAt: __nullable__(t.Date()),
          refreshTokenExpiresAt: __nullable__(t.Date()),
          scope: __nullable__(t.String()),
          password: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    apikeys: t.Array(
      t.Object(
        {
          id: t.String(),
          name: __nullable__(t.String()),
          start: __nullable__(t.String()),
          prefix: __nullable__(t.String()),
          key: t.String(),
          userId: t.String(),
          refillInterval: __nullable__(t.Integer()),
          refillAmount: __nullable__(t.Integer()),
          lastRefillAt: __nullable__(t.Date()),
          enabled: __nullable__(t.Boolean()),
          rateLimitEnabled: __nullable__(t.Boolean()),
          rateLimitTimeWindow: __nullable__(t.Integer()),
          rateLimitMax: __nullable__(t.Integer()),
          requestCount: __nullable__(t.Integer()),
          remaining: __nullable__(t.Integer()),
          lastRequest: __nullable__(t.Date()),
          expiresAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          permissions: __nullable__(t.String()),
          metadata: __nullable__(t.String()),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    createdServices: t.Array(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          description: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    updatedServices: t.Array(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          description: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    createdServiceRoutes: t.Array(
      t.Object(
        {
          id: t.Integer(),
          serviceId: t.String(),
          order: t.Integer(),
          condition: t.String(),
          description: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    updatedServiceRoutes: t.Array(
      t.Object(
        {
          id: t.Integer(),
          serviceId: t.String(),
          order: t.Integer(),
          condition: t.String(),
          description: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    createdGlobalCustomFields: t.Array(
      t.Object(
        {
          id: t.Integer(),
          path: t.String(),
          type: t.Union(
            [
              t.Literal("STRING"),
              t.Literal("NUMBER"),
              t.Literal("BOOLEAN"),
              t.Literal("ENUM"),
              t.Literal("DATE"),
              t.Literal("ARRAY"),
            ],
            { additionalProperties: false },
          ),
          required: t.Boolean(),
          enumValues: __nullable__(t.Any()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    updatedGlobalCustomFields: t.Array(
      t.Object(
        {
          id: t.Integer(),
          path: t.String(),
          type: t.Union(
            [
              t.Literal("STRING"),
              t.Literal("NUMBER"),
              t.Literal("BOOLEAN"),
              t.Literal("ENUM"),
              t.Literal("DATE"),
              t.Literal("ARRAY"),
            ],
            { additionalProperties: false },
          ),
          required: t.Boolean(),
          enumValues: __nullable__(t.Any()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    createdIncidentTypes: t.Array(
      t.Object(
        {
          id: t.Integer(),
          name: t.String(),
          serviceId: t.String(),
          title: t.String(),
          description: t.String(),
          condition: t.String(),
          groupCondition: __nullable__(t.String()),
          priority: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    updatedIncidentTypes: t.Array(
      t.Object(
        {
          id: t.Integer(),
          name: t.String(),
          serviceId: t.String(),
          title: t.String(),
          description: t.String(),
          condition: t.String(),
          groupCondition: __nullable__(t.String()),
          priority: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    createdApikeys: t.Array(
      t.Object(
        {
          id: t.String(),
          name: __nullable__(t.String()),
          start: __nullable__(t.String()),
          prefix: __nullable__(t.String()),
          key: t.String(),
          userId: t.String(),
          refillInterval: __nullable__(t.Integer()),
          refillAmount: __nullable__(t.Integer()),
          lastRefillAt: __nullable__(t.Date()),
          enabled: __nullable__(t.Boolean()),
          rateLimitEnabled: __nullable__(t.Boolean()),
          rateLimitTimeWindow: __nullable__(t.Integer()),
          rateLimitMax: __nullable__(t.Integer()),
          requestCount: __nullable__(t.Integer()),
          remaining: __nullable__(t.Integer()),
          lastRequest: __nullable__(t.Date()),
          expiresAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          permissions: __nullable__(t.String()),
          metadata: __nullable__(t.String()),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    updatedApikeys: t.Array(
      t.Object(
        {
          id: t.String(),
          name: __nullable__(t.String()),
          start: __nullable__(t.String()),
          prefix: __nullable__(t.String()),
          key: t.String(),
          userId: t.String(),
          refillInterval: __nullable__(t.Integer()),
          refillAmount: __nullable__(t.Integer()),
          lastRefillAt: __nullable__(t.Date()),
          enabled: __nullable__(t.Boolean()),
          rateLimitEnabled: __nullable__(t.Boolean()),
          rateLimitTimeWindow: __nullable__(t.Integer()),
          rateLimitMax: __nullable__(t.Integer()),
          requestCount: __nullable__(t.Integer()),
          remaining: __nullable__(t.Integer()),
          lastRequest: __nullable__(t.Date()),
          expiresAt: __nullable__(t.Date()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          permissions: __nullable__(t.String()),
          metadata: __nullable__(t.String()),
          createdById: t.String(),
          updatedById: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const UserPlainInputCreate = t.Object(
  {
    name: t.String(),
    email: t.String(),
    emailVerified: t.Boolean(),
    image: t.Optional(__nullable__(t.String())),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    role: t.Optional(__nullable__(t.String())),
    banned: t.Optional(__nullable__(t.Boolean())),
    banReason: t.Optional(__nullable__(t.String())),
    banExpires: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const UserPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    email: t.Optional(t.String()),
    emailVerified: t.Optional(t.Boolean()),
    image: t.Optional(__nullable__(t.String())),
    createdAt: t.Optional(t.Date()),
    updatedAt: t.Optional(t.Date()),
    role: t.Optional(__nullable__(t.String())),
    banned: t.Optional(__nullable__(t.Boolean())),
    banReason: t.Optional(__nullable__(t.String())),
    banExpires: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const UserRelationsInputCreate = t.Object(
  {
    sessions: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    accounts: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    apikeys: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    createdServices: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    updatedServices: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    createdServiceRoutes: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    updatedServiceRoutes: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    createdGlobalCustomFields: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    updatedGlobalCustomFields: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    createdIncidentTypes: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    updatedIncidentTypes: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    createdApikeys: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    updatedApikeys: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const UserRelationsInputUpdate = t.Partial(
  t.Object(
    {
      sessions: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      accounts: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      apikeys: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      createdServices: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      updatedServices: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      createdServiceRoutes: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      updatedServiceRoutes: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      createdGlobalCustomFields: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      updatedGlobalCustomFields: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      createdIncidentTypes: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      updatedIncidentTypes: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      createdApikeys: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      updatedApikeys: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const UserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          role: t.String(),
          banned: t.Boolean(),
          banReason: t.String(),
          banExpires: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "User" },
  ),
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              email: t.String(),
              email: t.Object(
                { email: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ email: t.String() }),
            t.Object({
              email: t.Object(
                { email: t.String() },
                { additionalProperties: false },
              ),
            }),
          ],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              name: t.String(),
              email: t.String(),
              emailVerified: t.Boolean(),
              image: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              role: t.String(),
              banned: t.Boolean(),
              banReason: t.String(),
              banExpires: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      email: t.Boolean(),
      emailVerified: t.Boolean(),
      image: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      sessions: t.Boolean(),
      accounts: t.Boolean(),
      apikeys: t.Boolean(),
      createdServices: t.Boolean(),
      updatedServices: t.Boolean(),
      createdServiceRoutes: t.Boolean(),
      updatedServiceRoutes: t.Boolean(),
      createdGlobalCustomFields: t.Boolean(),
      updatedGlobalCustomFields: t.Boolean(),
      createdIncidentTypes: t.Boolean(),
      updatedIncidentTypes: t.Boolean(),
      createdApikeys: t.Boolean(),
      updatedApikeys: t.Boolean(),
      role: t.Boolean(),
      banned: t.Boolean(),
      banReason: t.Boolean(),
      banExpires: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserInclude = t.Partial(
  t.Object(
    {
      sessions: t.Boolean(),
      accounts: t.Boolean(),
      apikeys: t.Boolean(),
      createdServices: t.Boolean(),
      updatedServices: t.Boolean(),
      createdServiceRoutes: t.Boolean(),
      updatedServiceRoutes: t.Boolean(),
      createdGlobalCustomFields: t.Boolean(),
      updatedGlobalCustomFields: t.Boolean(),
      createdIncidentTypes: t.Boolean(),
      updatedIncidentTypes: t.Boolean(),
      createdApikeys: t.Boolean(),
      updatedApikeys: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      emailVerified: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      image: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      role: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      banned: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      banReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      banExpires: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const User = t.Composite([UserPlain, UserRelations], {
  additionalProperties: false,
});

export const UserInputCreate = t.Composite(
  [UserPlainInputCreate, UserRelationsInputCreate],
  { additionalProperties: false },
);

export const UserInputUpdate = t.Composite(
  [UserPlainInputUpdate, UserRelationsInputUpdate],
  { additionalProperties: false },
);

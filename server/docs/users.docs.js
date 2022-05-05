/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *      properties:
 *        id:
 *          type: string
 *          description: auto-generated FMEA ID
 *        name:
 *          type: string
 *          description: Name of the user
 *        role:
 *          type: string
 *          description: The role of the user
 *        email:
 *          type: string
 *          description: Email of the user
 *        password:
 *          type: string
 *          description:  Password of the user
 *
 */

/**
 * @swagger
 * /api/v1/users/register:
 *  post:
 *    description: Register as a new User
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      200:
 *        description: Success
 */

/**
 * @swagger
 * /api/v1/users/login:
 *  post:
 *    description: Login as a new User
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      200:
 *        description: Success
 */

/**
 * @swagger
 * /api/v1/users/:
 *  get:
 *    summary: Returns all Users
 *    security:
 *      - bearerAuth: []
 *    description: Get Users
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 *      401:
 *        description: not authorised
 */

/**
 * @swagger
 * /api/v1/users/id/{id}:
 *  get:
 *    summary: Get a specific User
 *    security:
 *      - bearerAuth: []
 *    description: Get a User based on the id
 *    tags: [Users]
 *    parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *        required: true
 *      description: ID of the User
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 *      401:
 *        description: not authorised
 *      404:
 *        description: No User with this id was found
 */

/**
 * @swagger
 * /api/v1/users/count:
 *  get:
 *    summary: Returns the amount of Users currently registered
 *    security:
 *      - bearerAuth: []
 *    description: Get the amount of Users currently registered
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        description: not authorised
 */

/**
 * @swagger
 * /api/v1/users/update/{id}:
 *  put:
 *    summary: Update a User
 *    security:
 *      - bearerAuth: []
 *    description: Update a User
 *    tags: [Users]
 *    parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *        required: true
 *      description: ID of the User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/User'
 *      401:
 *        description: not authorised
 */

/**
 * @swagger
 * /api/v1/users/delete/{id}:
 *  delete:
 *    summary: Delete a specific User
 *    security:
 *      - bearerAuth: []
 *    description: Delete a User
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *        description: ID of the User
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 *      401:
 *        description: not authorised
 */

const request = require('supertest');
const helpers = require('../helpers');
const { app, server } = require('../../../app');

describe('/api/places', () => {

  afterAll(() => {
    server.close();
  });

  describe('GET /places', () => {

    it('should return the first page of places with a limit of 10 places per page when no query params are provided', async () => {
      const response = await request(app)
        .get('/api/places')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('links');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('google_places_id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('address');
      expect(response.body.data[0]).toHaveProperty('city');
      expect(response.body.data[0]).toHaveProperty('state');
      expect(response.body.data[0]).toHaveProperty('zip');
      expect(response.body.data[0]).toHaveProperty('loc');
      expect(response.body.data[0]).toHaveProperty('recommendations');
      expect(response.body.data[0]).toHaveProperty('ratings_counts');
      expect(response.body.data[0]).toHaveProperty('is_operational');
      expect(response.body.data[0]).toHaveProperty('is_archived');
      expect(response.body.data[0]).toHaveProperty('is_approved');
      expect(response.body.data[0]).toHaveProperty('is_flagged');

      for (const place of response.body.data) {
        expect(place.is_archived).toBe(false);
        expect(place.is_approved).toBe(true);
        expect(place.is_flagged).toBe(false);
        expect(place.is_operational).toBe(true);
      }
    });

    it('should return the first page of places with a limit of 10 places per page when invalid query params are provided', async () => {
      const response = await request(app)
        .get('/api/places?page=a&limit=b')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
    });

    it('should return a list of places when valid page and limit query params are provided', async () => {
      const response = await request(app)
        .get('/api/places?page=2&limit=5')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(parseInt(response.body.page)).toBe(2);
      expect(parseInt(response.body.limit)).toBe(5);
    });

    it('should return an empty array if no places are returned', async () => {
      await helpers.resetDatabase();

      const response = await request(app)
        .get('/api/places')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /places/:place_id', () => {

    it('should return place information for a single place', async () => {
      const response = await request(app)
        .get('/api/places/1')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('google_places_id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('city');
      expect(response.body).toHaveProperty('state');
      expect(response.body).toHaveProperty('zip');
      expect(response.body).toHaveProperty('loc');
      expect(response.body).toHaveProperty('recommendations');
      expect(response.body).toHaveProperty('ratings_counts');
      expect(response.body).toHaveProperty('is_operational');
      expect(response.body).toHaveProperty('is_archived');
      expect(response.body).toHaveProperty('is_approved');
      expect(response.body).toHaveProperty('is_flagged');
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('updated_at');
      expect(response.body).toHaveProperty('approved_by');
      expect(response.body).toHaveProperty('archived_at');
    });

    it('should return data even if the place is non-operational', async () => {
      const response = await request(app)
        .get('/api/places/3')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
      expect(response.body.is_operational).toBe(false);
    });

    it('should return a 404 if no place is found', async () => {
      const response = await request(app)
        .get('/api/places/100')
        .expect(404);

      expect(response.body).toEqual({ message: 'Place not found' });
    })

    it('should not return data for a place where is_archived is true', async () => {
      const response = await request(app)
        .get('/api/places/8')
        .expect(404)

      expect(response.body).toEqual({ message: 'Place not found' })
    });

    it('should not return data for a place where is_approved is false', async () => {
      const response = await request(app)
        .get('/api/places/9')
        .expect(404)

      expect(response.body).toEqual({ message: 'Place not found' })
    });

    it('should not return data for a place where is_flagged is true', async () => {
      const response = await request(app)
        .get('/api/places/10')
        .expect(404)

      expect(response.body).toEqual({ message: 'Place not found' })
    });
  });

  describe('GET /places/details', () => {

    it('should return details from the Google Places API when provided a valid Google Places ID as query param', async () => {
      const response = await request(app)
        .get('/api/places/details/ChIJDcqkQ4eBhYARqz7JBnMkmbE')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toBeTruthy();
    });

    it('should return a 404 response code is no details are returned by Google Places API', async () => {
      const response = await request(app)
        .get('/api/places/details/invalid')
        .expect(404);

      expect(response.body).toEqual({ message: 'Place not found' });
    });
  });
});
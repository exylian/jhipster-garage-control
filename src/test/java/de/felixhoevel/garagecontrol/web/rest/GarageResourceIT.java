package de.felixhoevel.garagecontrol.web.rest;

import de.felixhoevel.garagecontrol.GarageControlApp;
import de.felixhoevel.garagecontrol.domain.Garage;
import de.felixhoevel.garagecontrol.repository.GarageRepository;
import de.felixhoevel.garagecontrol.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static de.felixhoevel.garagecontrol.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link GarageResource} REST controller.
 */
@SpringBootTest(classes = GarageControlApp.class)
public class GarageResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private GarageRepository garageRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restGarageMockMvc;

    private Garage garage;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GarageResource garageResource = new GarageResource(garageRepository);
        this.restGarageMockMvc = MockMvcBuilders.standaloneSetup(garageResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Garage createEntity(EntityManager em) {
        Garage garage = new Garage()
            .description(DEFAULT_DESCRIPTION);
        return garage;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Garage createUpdatedEntity(EntityManager em) {
        Garage garage = new Garage()
            .description(UPDATED_DESCRIPTION);
        return garage;
    }

    @BeforeEach
    public void initTest() {
        garage = createEntity(em);
    }

    @Test
    @Transactional
    public void createGarage() throws Exception {
        int databaseSizeBeforeCreate = garageRepository.findAll().size();

        // Create the Garage
        restGarageMockMvc.perform(post("/api/garages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(garage)))
            .andExpect(status().isCreated());

        // Validate the Garage in the database
        List<Garage> garageList = garageRepository.findAll();
        assertThat(garageList).hasSize(databaseSizeBeforeCreate + 1);
        Garage testGarage = garageList.get(garageList.size() - 1);
        assertThat(testGarage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createGarageWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = garageRepository.findAll().size();

        // Create the Garage with an existing ID
        garage.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGarageMockMvc.perform(post("/api/garages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(garage)))
            .andExpect(status().isBadRequest());

        // Validate the Garage in the database
        List<Garage> garageList = garageRepository.findAll();
        assertThat(garageList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllGarages() throws Exception {
        // Initialize the database
        garageRepository.saveAndFlush(garage);

        // Get all the garageList
        restGarageMockMvc.perform(get("/api/garages?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(garage.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getGarage() throws Exception {
        // Initialize the database
        garageRepository.saveAndFlush(garage);

        // Get the garage
        restGarageMockMvc.perform(get("/api/garages/{id}", garage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(garage.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGarage() throws Exception {
        // Get the garage
        restGarageMockMvc.perform(get("/api/garages/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGarage() throws Exception {
        // Initialize the database
        garageRepository.saveAndFlush(garage);

        int databaseSizeBeforeUpdate = garageRepository.findAll().size();

        // Update the garage
        Garage updatedGarage = garageRepository.findById(garage.getId()).get();
        // Disconnect from session so that the updates on updatedGarage are not directly saved in db
        em.detach(updatedGarage);
        updatedGarage
            .description(UPDATED_DESCRIPTION);

        restGarageMockMvc.perform(put("/api/garages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGarage)))
            .andExpect(status().isOk());

        // Validate the Garage in the database
        List<Garage> garageList = garageRepository.findAll();
        assertThat(garageList).hasSize(databaseSizeBeforeUpdate);
        Garage testGarage = garageList.get(garageList.size() - 1);
        assertThat(testGarage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingGarage() throws Exception {
        int databaseSizeBeforeUpdate = garageRepository.findAll().size();

        // Create the Garage

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGarageMockMvc.perform(put("/api/garages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(garage)))
            .andExpect(status().isBadRequest());

        // Validate the Garage in the database
        List<Garage> garageList = garageRepository.findAll();
        assertThat(garageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteGarage() throws Exception {
        // Initialize the database
        garageRepository.saveAndFlush(garage);

        int databaseSizeBeforeDelete = garageRepository.findAll().size();

        // Delete the garage
        restGarageMockMvc.perform(delete("/api/garages/{id}", garage.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Garage> garageList = garageRepository.findAll();
        assertThat(garageList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Garage.class);
        Garage garage1 = new Garage();
        garage1.setId(1L);
        Garage garage2 = new Garage();
        garage2.setId(garage1.getId());
        assertThat(garage1).isEqualTo(garage2);
        garage2.setId(2L);
        assertThat(garage1).isNotEqualTo(garage2);
        garage1.setId(null);
        assertThat(garage1).isNotEqualTo(garage2);
    }
}

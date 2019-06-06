package de.felixhoevel.garagecontrol.web.rest;

import de.felixhoevel.garagecontrol.GarageControlApp;
import de.felixhoevel.garagecontrol.domain.GarageCode;
import de.felixhoevel.garagecontrol.repository.GarageCodeRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static de.felixhoevel.garagecontrol.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link GarageCodeResource} REST controller.
 */
@SpringBootTest(classes = GarageControlApp.class)
public class GarageCodeResourceIT {

    private static final LocalDate DEFAULT_CREATED_AT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_AT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_VALID_UNTIL = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_VALID_UNTIL = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private GarageCodeRepository garageCodeRepository;

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

    private MockMvc restGarageCodeMockMvc;

    private GarageCode garageCode;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GarageCodeResource garageCodeResource = new GarageCodeResource(garageCodeRepository);
        this.restGarageCodeMockMvc = MockMvcBuilders.standaloneSetup(garageCodeResource)
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
    public static GarageCode createEntity(EntityManager em) {
        GarageCode garageCode = new GarageCode()
            .createdAt(DEFAULT_CREATED_AT)
            .validUntil(DEFAULT_VALID_UNTIL);
        return garageCode;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GarageCode createUpdatedEntity(EntityManager em) {
        GarageCode garageCode = new GarageCode()
            .createdAt(UPDATED_CREATED_AT)
            .validUntil(UPDATED_VALID_UNTIL);
        return garageCode;
    }

    @BeforeEach
    public void initTest() {
        garageCode = createEntity(em);
    }

    @Test
    @Transactional
    public void createGarageCode() throws Exception {
        int databaseSizeBeforeCreate = garageCodeRepository.findAll().size();

        // Create the GarageCode
        restGarageCodeMockMvc.perform(post("/api/garage-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(garageCode)))
            .andExpect(status().isCreated());

        // Validate the GarageCode in the database
        List<GarageCode> garageCodeList = garageCodeRepository.findAll();
        assertThat(garageCodeList).hasSize(databaseSizeBeforeCreate + 1);
        GarageCode testGarageCode = garageCodeList.get(garageCodeList.size() - 1);
        assertThat(testGarageCode.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testGarageCode.getValidUntil()).isEqualTo(DEFAULT_VALID_UNTIL);
    }

    @Test
    @Transactional
    public void createGarageCodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = garageCodeRepository.findAll().size();

        // Create the GarageCode with an existing ID
        garageCode.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGarageCodeMockMvc.perform(post("/api/garage-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(garageCode)))
            .andExpect(status().isBadRequest());

        // Validate the GarageCode in the database
        List<GarageCode> garageCodeList = garageCodeRepository.findAll();
        assertThat(garageCodeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllGarageCodes() throws Exception {
        // Initialize the database
        garageCodeRepository.saveAndFlush(garageCode);

        // Get all the garageCodeList
        restGarageCodeMockMvc.perform(get("/api/garage-codes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(garageCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].validUntil").value(hasItem(DEFAULT_VALID_UNTIL.toString())));
    }
    
    @Test
    @Transactional
    public void getGarageCode() throws Exception {
        // Initialize the database
        garageCodeRepository.saveAndFlush(garageCode);

        // Get the garageCode
        restGarageCodeMockMvc.perform(get("/api/garage-codes/{id}", garageCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(garageCode.getId().intValue()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.validUntil").value(DEFAULT_VALID_UNTIL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGarageCode() throws Exception {
        // Get the garageCode
        restGarageCodeMockMvc.perform(get("/api/garage-codes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGarageCode() throws Exception {
        // Initialize the database
        garageCodeRepository.saveAndFlush(garageCode);

        int databaseSizeBeforeUpdate = garageCodeRepository.findAll().size();

        // Update the garageCode
        GarageCode updatedGarageCode = garageCodeRepository.findById(garageCode.getId()).get();
        // Disconnect from session so that the updates on updatedGarageCode are not directly saved in db
        em.detach(updatedGarageCode);
        updatedGarageCode
            .createdAt(UPDATED_CREATED_AT)
            .validUntil(UPDATED_VALID_UNTIL);

        restGarageCodeMockMvc.perform(put("/api/garage-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGarageCode)))
            .andExpect(status().isOk());

        // Validate the GarageCode in the database
        List<GarageCode> garageCodeList = garageCodeRepository.findAll();
        assertThat(garageCodeList).hasSize(databaseSizeBeforeUpdate);
        GarageCode testGarageCode = garageCodeList.get(garageCodeList.size() - 1);
        assertThat(testGarageCode.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testGarageCode.getValidUntil()).isEqualTo(UPDATED_VALID_UNTIL);
    }

    @Test
    @Transactional
    public void updateNonExistingGarageCode() throws Exception {
        int databaseSizeBeforeUpdate = garageCodeRepository.findAll().size();

        // Create the GarageCode

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGarageCodeMockMvc.perform(put("/api/garage-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(garageCode)))
            .andExpect(status().isBadRequest());

        // Validate the GarageCode in the database
        List<GarageCode> garageCodeList = garageCodeRepository.findAll();
        assertThat(garageCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteGarageCode() throws Exception {
        // Initialize the database
        garageCodeRepository.saveAndFlush(garageCode);

        int databaseSizeBeforeDelete = garageCodeRepository.findAll().size();

        // Delete the garageCode
        restGarageCodeMockMvc.perform(delete("/api/garage-codes/{id}", garageCode.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<GarageCode> garageCodeList = garageCodeRepository.findAll();
        assertThat(garageCodeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GarageCode.class);
        GarageCode garageCode1 = new GarageCode();
        garageCode1.setId(1L);
        GarageCode garageCode2 = new GarageCode();
        garageCode2.setId(garageCode1.getId());
        assertThat(garageCode1).isEqualTo(garageCode2);
        garageCode2.setId(2L);
        assertThat(garageCode1).isNotEqualTo(garageCode2);
        garageCode1.setId(null);
        assertThat(garageCode1).isNotEqualTo(garageCode2);
    }
}

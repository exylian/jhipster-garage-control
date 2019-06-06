package de.felixhoevel.garagecontrol.web.rest;

import de.felixhoevel.garagecontrol.domain.GarageCode;
import de.felixhoevel.garagecontrol.repository.GarageCodeRepository;
import de.felixhoevel.garagecontrol.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link de.felixhoevel.garagecontrol.domain.GarageCode}.
 */
@RestController
@RequestMapping("/api")
public class GarageCodeResource {

    private final Logger log = LoggerFactory.getLogger(GarageCodeResource.class);

    private static final String ENTITY_NAME = "garageCode";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GarageCodeRepository garageCodeRepository;

    public GarageCodeResource(GarageCodeRepository garageCodeRepository) {
        this.garageCodeRepository = garageCodeRepository;
    }

    /**
     * {@code POST  /garage-codes} : Create a new garageCode.
     *
     * @param garageCode the garageCode to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new garageCode, or with status {@code 400 (Bad Request)} if the garageCode has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/garage-codes")
    public ResponseEntity<GarageCode> createGarageCode(@RequestBody GarageCode garageCode) throws URISyntaxException {
        log.debug("REST request to save GarageCode : {}", garageCode);
        if (garageCode.getId() != null) {
            throw new BadRequestAlertException("A new garageCode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GarageCode result = garageCodeRepository.save(garageCode);
        return ResponseEntity.created(new URI("/api/garage-codes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /garage-codes} : Updates an existing garageCode.
     *
     * @param garageCode the garageCode to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated garageCode,
     * or with status {@code 400 (Bad Request)} if the garageCode is not valid,
     * or with status {@code 500 (Internal Server Error)} if the garageCode couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/garage-codes")
    public ResponseEntity<GarageCode> updateGarageCode(@RequestBody GarageCode garageCode) throws URISyntaxException {
        log.debug("REST request to update GarageCode : {}", garageCode);
        if (garageCode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        GarageCode result = garageCodeRepository.save(garageCode);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, garageCode.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /garage-codes} : get all the garageCodes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of garageCodes in body.
     */
    @GetMapping("/garage-codes")
    public List<GarageCode> getAllGarageCodes() {
        log.debug("REST request to get all GarageCodes");
        return garageCodeRepository.findAll();
    }

    /**
     * {@code GET  /garage-codes/:id} : get the "id" garageCode.
     *
     * @param id the id of the garageCode to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the garageCode, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/garage-codes/{id}")
    public ResponseEntity<GarageCode> getGarageCode(@PathVariable Long id) {
        log.debug("REST request to get GarageCode : {}", id);
        Optional<GarageCode> garageCode = garageCodeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(garageCode);
    }

    /**
     * {@code DELETE  /garage-codes/:id} : delete the "id" garageCode.
     *
     * @param id the id of the garageCode to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/garage-codes/{id}")
    public ResponseEntity<Void> deleteGarageCode(@PathVariable Long id) {
        log.debug("REST request to delete GarageCode : {}", id);
        garageCodeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}

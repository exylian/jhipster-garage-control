package de.felixhoevel.garagecontrol.web.rest;

import de.felixhoevel.garagecontrol.domain.Garage;
import de.felixhoevel.garagecontrol.service.GarageService;
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
 * REST controller for managing {@link de.felixhoevel.garagecontrol.domain.Garage}.
 */
@RestController
@RequestMapping("/api")
public class GarageResource {

    private final Logger log = LoggerFactory.getLogger(GarageResource.class);

    private static final String ENTITY_NAME = "garage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GarageService garageService;

    public GarageResource(GarageService garageService) {
        this.garageService = garageService;
    }

    /**
     * {@code POST  /garages} : Create a new garage.
     *
     * @param garage the garage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new garage, or with status {@code 400 (Bad Request)} if the garage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/garages")
    public ResponseEntity<Garage> createGarage(@RequestBody Garage garage) throws URISyntaxException {
        log.debug("REST request to save Garage : {}", garage);
        if (garage.getId() != null) {
            throw new BadRequestAlertException("A new garage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Garage result = garageService.save(garage);
        return ResponseEntity.created(new URI("/api/garages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /garages} : Updates an existing garage.
     *
     * @param garage the garage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated garage,
     * or with status {@code 400 (Bad Request)} if the garage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the garage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/garages")
    public ResponseEntity<Garage> updateGarage(@RequestBody Garage garage) throws URISyntaxException {
        log.debug("REST request to update Garage : {}", garage);
        if (garage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Garage result = garageService.save(garage);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, garage.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /garages} : get all the garages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of garages in body.
     */
    @GetMapping("/garages")
    public List<Garage> getAllGarages() {
        log.debug("REST request to get all Garages");
        return garageService.findAll();
    }

    /**
     * {@code GET  /garages/:id} : get the "id" garage.
     *
     * @param id the id of the garage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the garage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/garages/{id}")
    public ResponseEntity<Garage> getGarage(@PathVariable Long id) {
        log.debug("REST request to get Garage : {}", id);
        Optional<Garage> garage = garageService.findOne(id);
        return ResponseUtil.wrapOrNotFound(garage);
    }

    /**
     * {@code DELETE  /garages/:id} : delete the "id" garage.
     *
     * @param id the id of the garage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/garages/{id}")
    public ResponseEntity<Void> deleteGarage(@PathVariable Long id) {
        log.debug("REST request to delete Garage : {}", id);
        garageService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
